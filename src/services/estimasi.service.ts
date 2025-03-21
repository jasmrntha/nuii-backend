import { getDistance, computeDestinationPoint } from 'geolib';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../middleware';
import { type RouteRequest } from '../models';
import { Material, Konstruksi, KonstruksiMaterial } from '../repositories';

// const MIN_POLE_DISTANCE = 40;
const IDEAL_POLE_DISTANCE = 50;

// Remove Duplicate Poles
function removeDuplicates(poles: { latitude: number; longitude: number }[]) {
  const seen = new Set<string>(); // Store unique coordinates as strings

  return poles.filter(pole => {
    const key = `${pole.latitude.toFixed(6)},${pole.longitude.toFixed(6)}`; // Convert to string with precision

    if (seen.has(key)) {
      return false; // Duplicate found, skip this pole
    }

    seen.add(key);

    return true; // Unique pole, keep it
  });
}

// Calculate the angle between two bearings (in degrees)
function calculateTurnAngle(
  approachBearing: number,
  departureBearing: number,
): number {
  // Calculate the angle between the two bearings
  let turnAngle = departureBearing - approachBearing;

  // Normalize to the range [-180, 180]
  if (turnAngle > 180) {
    turnAngle -= 360;
  } else if (turnAngle < -180) {
    turnAngle += 360;
  }

  // Return the absolute value of the angle
  return Math.abs(turnAngle);
}

function calculatePathLength(
  path: { latitude: number; longitude: number }[],
): number {
  let totalDistance = 0;

  for (let index = 0; index < path.length - 1; index++) {
    const pole = path[index];
    const nextPole = path[index + 1];

    const distance = getDistance(pole, nextPole);
    totalDistance += distance;
  }

  return totalDistance;
}

// // Determine the turn type based on the angle
function getTurnType(angle: number): number {
  if (angle < 15) {
    return 9;
  } else if (angle < 30) {
    return 11;
  } else if (angle < 60) {
    return 12;
  } else if (angle < 90) {
    return 14;
  } else {
    return 9;
  }
}

// Calculate bearing between two points
function getBearing(
  start: { latitude: number; longitude: number },
  end: { latitude: number; longitude: number },
) {
  const startLatRad = (start.latitude * Math.PI) / 180;
  const endLatRad = (end.latitude * Math.PI) / 180;
  const longDiffRad = ((end.longitude - start.longitude) * Math.PI) / 180;

  const y = Math.sin(longDiffRad) * Math.cos(endLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(endLatRad) -
    Math.sin(startLatRad) * Math.cos(endLatRad) * Math.cos(longDiffRad);
  const bearingRad = Math.atan2(y, x);
  const bearingDeg = (bearingRad * 180) / Math.PI;

  return (bearingDeg + 360) % 360;
}

// Convert coordinates from the API format to geolib format
function convertCoordinates(coordinates: { lat: number; lng: number }[]) {
  return coordinates.map(coord => ({
    latitude: coord.lat,
    longitude: coord.lng,
  }));
}

function assignConstruction(
  poles: { latitude: number; longitude: number }[],
  maneuverPoints: { latitude: number; longitude: number }[] = [],
) {
  const assignedPoles: {
    latitude: number;
    longitude: number;
    id_konstruksi: number;
    id_tiang: number;
  }[] = [];

  // Track usage of each construction and pole type
  const constructionUsage: Record<number, number> = {};
  const tiangUsage: Record<number, number> = {};

  if (poles.length < 2) {
    return { assignedPoles, constructionUsage, tiangUsage };
  }

  // Helper function to check if a point is a maneuver point
  function isManeuverPoint(point: { latitude: number; longitude: number }) {
    return maneuverPoints.some(
      m =>
        Math.abs(m.latitude - point.latitude) < 1e-7 &&
        Math.abs(m.longitude - point.longitude) < 1e-7,
    );
  }

  // Helper function to track usage
  function trackUsage(id_konstruksi: number, id_tiang: number) {
    // Track construction usage
    constructionUsage[id_konstruksi] =
      (constructionUsage[id_konstruksi] || 0) + 1;

    // Track pole type usage
    tiangUsage[id_tiang] = (tiangUsage[id_tiang] || 0) + 1;
  }

  // Assign the first pole
  const firstPoleKonstruksi = 1;
  const firstPoleTiang = 1;

  assignedPoles.push({
    ...poles[0],
    id_konstruksi: firstPoleKonstruksi,
    id_tiang: firstPoleTiang,
  });

  trackUsage(firstPoleKonstruksi, firstPoleTiang);

  // Process intermediate poles
  for (let index = 1; index < poles.length - 1; index++) {
    const previousPole = poles[index - 1];
    const currentPole = poles[index];
    const nextPole = poles[index + 1];

    let idKonstruksi = 9; // Default to straight line
    const idTiang = 243; // Default pole type

    if (isManeuverPoint(currentPole)) {
      // This is a maneuver point, determine the turn type
      const approachBearing = getBearing(previousPole, currentPole);
      const departureBearing = getBearing(currentPole, nextPole);
      const turnAngle = calculateTurnAngle(approachBearing, departureBearing);
      idKonstruksi = getTurnType(turnAngle);
    }

    assignedPoles.push({
      ...currentPole,
      id_konstruksi: idKonstruksi,
      id_tiang: idTiang,
    });

    trackUsage(idKonstruksi, idTiang);
  }

  // Assign the last pole
  if (poles.length > 1) {
    const lastPoleKonstruksi = 1;
    const lastPoleTiang = 1;

    assignedPoles.push({
      ...poles.at(-1),
      id_konstruksi: lastPoleKonstruksi,
      id_tiang: lastPoleTiang,
    });

    trackUsage(lastPoleKonstruksi, lastPoleTiang);
  }

  return { assignedPoles, constructionUsage, tiangUsage };
}

// Place poles along a route, ensuring poles are placed at maneuver points
function placePoles(
  route: { latitude: number; longitude: number }[],
  instructions: {
    type: string;
    distance: number;
    time: number;
    road: string;
    direction: string;
    index: number;
    mode: string;
    modifier: string;
    text: string;
  }[],
) {
  const poles: { latitude: number; longitude: number }[] = [];

  // Skip if route is too short
  if (route.length < 2) {
    return poles;
  }

  // Process instructions to find U-turns and other turn points
  const turnIndices: number[] = [];
  const uTurnData: {
    beforeIndex: number;
    uTurnIndex: number;
    afterIndex: number;
    distanceBeforeUTurn: number;
    distanceAfterUTurn: number;
    nextInstructionIndex: number;
  }[] = [];

  // Create a set of important turn points that should have poles
  const importantTurnIndices = new Set<number>();

  // First pass: identify all turn points and U-turns
  for (let index = 0; index < instructions.length; index++) {
    const instruction = instructions[index];

    if (instruction.modifier === 'Uturn') {
      // Found a U-turn, need to get the instruction before and after
      const beforeIndex = index > 0 ? instructions[index - 1].index : 0;
      const uTurnIndex = instruction.index;

      // Get the next instruction after the U-turn
      const nextInstructionIndex =
        index < instructions.length - 1 ? index + 1 : -1;
      const afterIndex =
        nextInstructionIndex >= 0
          ? instructions[nextInstructionIndex].index
          : route.length - 1;

      // Calculate distance from before-U-turn to U-turn
      let distanceBeforeUTurn = 0;

      for (let indexJ = beforeIndex; indexJ < uTurnIndex; indexJ++) {
        distanceBeforeUTurn += getDistance(route[indexJ], route[indexJ + 1]);
      }

      // Calculate distance from U-turn to next instruction
      let distanceAfterUTurn = 0;

      for (let indexJ = uTurnIndex + 1; indexJ < afterIndex; indexJ++) {
        distanceAfterUTurn += getDistance(route[indexJ], route[indexJ + 1]);
      }

      uTurnData.push({
        beforeIndex,
        uTurnIndex,
        afterIndex,
        distanceBeforeUTurn,
        distanceAfterUTurn,
        nextInstructionIndex:
          nextInstructionIndex >= 0
            ? instructions[nextInstructionIndex].index
            : -1,
      });

      console.log(
        `U-turn detected: Before index ${beforeIndex}, U-turn at ${uTurnIndex}, After index ${afterIndex}`,
      );
    } else {
      // Add other turn points
      turnIndices.push(instruction.index);
      importantTurnIndices.add(instruction.index);
    }
  }

  // Add start and end points as important
  importantTurnIndices.add(0);
  importantTurnIndices.add(route.length - 1);

  // Start with the first point of the route
  poles.push(route[0]);

  // Distance traveled since the last pole
  let distanceSinceLastPole = 0;

  // Process each segment of the route
  let index = 1;
  let skipToIndex = -1;

  while (index < route.length) {
    // Check if we need to skip to a specific index (after U-turn)
    if (skipToIndex > 0 && index < skipToIndex) {
      index = skipToIndex;
      continue;
    }

    // Check if we're at a point before a U-turn
    const uTurnPoint = uTurnData.find(u => u.beforeIndex === index - 1);

    if (uTurnPoint) {
      // U-turn handling (kept unchanged)
      console.log(
        `Processing segment with U-turn at index ${uTurnPoint.uTurnIndex}`,
      );

      const segmentStartBeforeUTurn = route[uTurnPoint.beforeIndex + 2];
      const uTurnLocation = route[uTurnPoint.uTurnIndex];
      const uTurnLocation2 = route[uTurnPoint.uTurnIndex + 1];
      const segmentDistance = getDistance(
        segmentStartBeforeUTurn,
        uTurnLocation,
      );

      const distanceAfterUTurn = getDistance(
        uTurnLocation2,
        route[uTurnPoint.afterIndex],
      );

      poles.push(segmentStartBeforeUTurn);
      distanceSinceLastPole = 0;

      // Calculate effective segment distance for pole placement
      const effectiveSegmentDistance = segmentDistance - distanceAfterUTurn;

      if (effectiveSegmentDistance >= 0) {
        const bearing = getBearing(segmentStartBeforeUTurn, uTurnLocation);
        let distanceAlongSegment = 0;

        while (distanceAlongSegment < effectiveSegmentDistance) {
          const distanceNeeded = IDEAL_POLE_DISTANCE - distanceSinceLastPole;

          if (
            distanceAlongSegment + distanceNeeded <=
            effectiveSegmentDistance
          ) {
            distanceAlongSegment += distanceNeeded;
            const newPolePosition = computeDestinationPoint(
              segmentStartBeforeUTurn,
              distanceAlongSegment,
              bearing,
            );
            poles.push(newPolePosition);
            distanceSinceLastPole = 0;
          } else {
            if (distanceAlongSegment == 0) {
              const newPolePosition = computeDestinationPoint(
                segmentStartBeforeUTurn,
                distanceAlongSegment + effectiveSegmentDistance,
                bearing,
              );
              poles.push(newPolePosition);
              distanceSinceLastPole = 0;
            } else {
              const newPolePosition = computeDestinationPoint(
                segmentStartBeforeUTurn,
                distanceAlongSegment +
                  (effectiveSegmentDistance - distanceAlongSegment),
                bearing,
              );
              poles.push(newPolePosition);
              distanceSinceLastPole = 0;
            }

            break;
          }
        }
      } else {
        const uTurnBearing = getBearing(uTurnLocation, uTurnLocation2);
        const uTurnDistance = getDistance(uTurnLocation, uTurnLocation2);

        const afterUTurn = Math.abs(effectiveSegmentDistance);

        poles.push(
          computeDestinationPoint(
            segmentStartBeforeUTurn,
            uTurnDistance,
            uTurnBearing,
          ),
        );
        distanceSinceLastPole = 0;

        if (afterUTurn >= 0) {
          const bearing = getBearing(
            poles.at(-1),
            poles[uTurnPoint.afterIndex],
          );
          let distanceAlongSegment = 0;

          while (distanceAlongSegment < afterUTurn) {
            const distanceNeeded = IDEAL_POLE_DISTANCE - distanceSinceLastPole;

            if (distanceAlongSegment + distanceNeeded <= afterUTurn) {
              distanceAlongSegment += distanceNeeded;
              const newPolePosition = computeDestinationPoint(
                segmentStartBeforeUTurn,
                distanceAlongSegment,
                bearing,
              );
              poles.push(newPolePosition);
              distanceSinceLastPole = 0;
            } else {
              if (distanceAlongSegment == 0) {
                const newPolePosition = computeDestinationPoint(
                  segmentStartBeforeUTurn,
                  distanceAlongSegment + afterUTurn,
                  bearing,
                );
                poles.push(newPolePosition);
                distanceSinceLastPole = 0;
              } else {
                const newPolePosition = computeDestinationPoint(
                  segmentStartBeforeUTurn,
                  distanceAlongSegment + (afterUTurn - distanceAlongSegment),
                  bearing,
                );
                poles.push(newPolePosition);
                distanceSinceLastPole = 0;
              }

              break;
            }
          }
        }
      }

      skipToIndex = uTurnPoint.afterIndex;
      index = skipToIndex;
      continue;
    }

    // *** New check for turn points ***
    // If the current point is a turn point, force a pole placement
    if (importantTurnIndices.has(index)) {
      // Force a pole at this turn point regardless of accumulated distance
      poles.push(route[index]);
      distanceSinceLastPole = 0;
      index++;
      continue;
    }

    // Standard processing for non-turn segments
    const segmentStart = route[index - 1];
    const segmentEnd = route[index];
    const segmentDistance = getDistance(segmentStart, segmentEnd);

    // Skip tiny segments
    if (segmentDistance < 1) {
      index++;
      continue;
    }

    const bearing = getBearing(segmentStart, segmentEnd);
    let distanceAlongSegment = 0;

    while (distanceAlongSegment < segmentDistance) {
      const distanceNeeded = IDEAL_POLE_DISTANCE - distanceSinceLastPole;

      if (distanceAlongSegment + distanceNeeded <= segmentDistance) {
        distanceAlongSegment += distanceNeeded;
        const newPolePosition = computeDestinationPoint(
          segmentStart,
          distanceAlongSegment,
          bearing,
        );
        poles.push(newPolePosition);
        distanceSinceLastPole = 0;
      } else {
        distanceSinceLastPole += segmentDistance - distanceAlongSegment;
        break;
      }
    }

    index++;
  }

  // Make sure we have a pole at the final point
  const lastPoint = route.at(-1);

  if (
    poles.length > 0 &&
    !(
      poles.at(-1).latitude === lastPoint.latitude &&
      poles.at(-1).longitude === lastPoint.longitude
    )
  ) {
    poles.push(lastPoint);
  }

  return poles;
}

async function calculateCost(
  constructionUsage: Record<number, number>,
  tiangUsage: Record<number, number>,
): Promise<{ totalMaterial: number; totalPasang: number }> {
  // Calculate the total cost based on construction and pole type usage
  let totalMaterial = 0;
  let totalPasang = 0;

  // Calculate cost based on usage
  for (const [idKonstruksi, count] of Object.entries(constructionUsage)) {
    // Cost calculation for construction types
    const konstruksi = await Konstruksi.findKonstruksiById(
      Number(idKonstruksi),
    );
    const konstruksiMaterial =
      await KonstruksiMaterial.findMaterialForKonstruksiById(
        Number(idKonstruksi),
      );

    if (konstruksi && konstruksiMaterial) {
      for (const material of konstruksiMaterial) {
        const materialCost = await Material.findMaterialById(
          material.id_material,
        );

        if (materialCost) {
          const hargaMaterial =
            count * materialCost.harga_material * Number(material.kuantitas);
          totalMaterial += hargaMaterial;

          const hargaPasang =
            count * materialCost.pasang_rab * Number(material.kuantitas);
          totalPasang += hargaPasang;
        }
      }
    }
  }

  for (const [idTiang, count] of Object.entries(tiangUsage)) {
    // Cost calculation for pole types
    const tiang = await Material.findMaterialById(Number(idTiang));

    if (tiang) {
      const hargaMaterial = count * tiang.harga_material;
      totalMaterial += hargaMaterial;

      const hargaPasang = count * tiang.pasang_rab;
      totalPasang += hargaPasang;
    }
  }

  return { totalMaterial, totalPasang };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const EstimasiService = {
  async getEstimasi(route: RouteRequest) {
    try {
      // Convert coordinates from the API format to geolib format
      const coordinates = convertCoordinates(route.coordinates);

      // Get instructions from the route
      const instructions = route.instructions;

      console.log(
        `Processing route with ${coordinates.length} coordinates and ${instructions.length} instructions`,
      );

      // Place poles along the route
      const allPoles = placePoles(coordinates, instructions);

      // Remove duplicate poles
      const uniquePoles = removeDuplicates(allPoles);

      // Get all turn points for visualization
      const turnPoints = instructions.map(
        instruction => coordinates[instruction.index],
      );

      // Get U-turn points specifically
      const uTurnPoints = instructions
        .filter(instruction => instruction.modifier === 'Uturn')
        .map(instruction => coordinates[instruction.index]);

      console.log(`Total route points: ${coordinates.length}`);
      console.log(`Total turn points: ${turnPoints.length}`);
      console.log(`Total U-turn points: ${uTurnPoints.length}`);
      console.log(`Total poles placed: ${uniquePoles.length}`);

      // If less than 2 poles added, throw an error
      if (uniquePoles.length < 2) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'Not enough poles placed for estimation',
        );
      }

      // Assign construction types to poles and track usage
      const { assignedPoles, constructionUsage, tiangUsage } =
        assignConstruction(uniquePoles, turnPoints);

      // Calculate total cost
      let { totalMaterial, totalPasang } = await calculateCost(
        constructionUsage,
        tiangUsage,
      );

      const konduktor = await Material.findMaterialById(5);
      const totalDistance = calculatePathLength(uniquePoles);
      totalMaterial += konduktor.harga_material * totalDistance;
      totalPasang += konduktor.pasang_rab * totalDistance;

      // Return the result
      return {
        totalMaterial,
        totalPasang,
        totalPoles: uniquePoles.length,
        totalDistance: totalDistance,
        poles: assignedPoles,
        routes: coordinates,
      };
    } catch (error) {
      console.error('Error in pole estimation:', error);

      throw error;
    }
  },
};
