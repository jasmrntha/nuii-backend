import polyline from '@mapbox/polyline';
import { getDistance, computeDestinationPoint, getPathLength } from 'geolib';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../middleware';
import { type RouteRequest } from '../models';

const MIN_POLE_DISTANCE = 40;
const IDEAL_POLE_DISTANCE = 50;

// Decode polyline to coordinates
function decodeRoute(encodedGeometry: string) {
  const decoded = polyline.decode(encodedGeometry);

  return decoded.map(coord => ({ latitude: coord[0], longitude: coord[1] }));
}

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
// function calculateTurnAngle(
//   approachBearing: number,
//   departureBearing: number,
// ): number {
//   // Calculate the angle between the two bearings
//   let turnAngle = departureBearing - approachBearing;

//   // Normalize to the range [-180, 180]
//   if (turnAngle > 180) {
//     turnAngle -= 360;
//   } else if (turnAngle < -180) {
//     turnAngle += 360;
//   }

//   // Return the absolute value of the angle
//   return Math.abs(turnAngle);
// }

// Determine the turn type based on the angle
// function getTurnType(angle: number): number {
//   if (angle < 20) {
//     return 0;
//   } else if (angle < 45) {
//     return 5;
//   } else if (angle < 120) {
//     return 2;
//   } else if (angle < 150) {
//     return 3;
//   } else {
//     return 4;
//   }
// }

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

// Find the index of the point in the route closest to the given maneuver location
function findClosestPointIndex(
  route: { latitude: number; longitude: number }[],
  maneuverLocation: [number, number],
) {
  const maneuverPoint = {
    latitude: maneuverLocation[0],
    longitude: maneuverLocation[1],
  };

  let closestIndex = 0;
  let minimumDistance = Number.POSITIVE_INFINITY;

  for (const [index, point] of route.entries()) {
    const distance = getDistance(maneuverPoint, point);

    if (distance < minimumDistance) {
      minimumDistance = distance;
      closestIndex = index;
    }
  }

  return closestIndex;
}

// function assignConstruction(
//   poles: { latitude: number; longitude: number }[],
//   maneuverLocations: [number, number][] = [],
// ) {
//   const assignedPoles: {
//     latitude: number;
//     longitude: number;
//     id_konstruksi: number;
//     id_tiang: number;
//   }[] = [];

//   if (poles.length < 2) {
//     return assignedPoles;
//   }

//   // Start with the first pole
//   let currentPole = poles[0];

//   // Assign the first pole
//   assignedPoles.push({
//     ...currentPole,
//     id_konstruksi: 1,
//     id_tiang: 1,
//   });

//   // Process each pole
//   for (let poleIndex = 1; poleIndex < poles.length - 1; poleIndex++) {
//     const pole = poles[poleIndex];

//     if (maneuverLocations.includes([pole.latitude, pole.longitude])) {
//       const previousPole = poles[poleIndex - 1];
//       const nextPole = poles[poleIndex + 1];

//       const approachBearing = getBearing(previousPole, currentPole);
//       const departureBearing = getBearing(currentPole, nextPole);

//       const turnAngle = calculateTurnAngle(approachBearing, departureBearing);
//       const turnType = getTurnType(turnAngle);

//       assignedPoles.push({
//         ...pole,
//         id_konstruksi: turnType,
//         id_tiang: 1,
//       });

//       currentPole = pole;
//       continue;
//     }

//     // Assign the pole to the current construction
//     assignedPoles.push({
//       ...pole,
//       id_konstruksi: 1,
//       id_tiang: 1,
//     });

//     // Move to the next pole
//     currentPole = pole;
//   }

//   // Start with the first pole
//   currentPole = poles.at(-1);

//   // Assign the first pole
//   assignedPoles.push({
//     ...currentPole,
//     id_konstruksi: 1,
//     id_tiang: 1,
//   });
// }

// Place poles along a route, ensuring poles are placed at maneuver points
function placePoles(
  route: { latitude: number; longitude: number }[],
  lastPole: { latitude: number; longitude: number } | null,
  maneuverLocations: [number, number][] = [],
) {
  const poles: { latitude: number; longitude: number }[] = [];

  // Skip if route is too short
  if (route.length < 2) {
    return poles;
  }

  // Find the indices of points closest to maneuver locations
  const maneuverIndices: number[] = maneuverLocations.map(location =>
    findClosestPointIndex(route, location),
  );

  console.log(`Found ${maneuverIndices.length} maneuver points in route`);

  // Start with last pole position or the first point of the route
  let currentPosition = lastPole || route[0];
  let currentRouteIndex = 0;

  // If there's a last pole, find the closest point on the route to start from
  if (lastPole) {
    let minimumDistance = Number.POSITIVE_INFINITY;

    for (const [index, point] of route.entries()) {
      const pointDistance = getDistance(lastPole, point);

      if (pointDistance < minimumDistance) {
        minimumDistance = pointDistance;
        currentRouteIndex = index;
      }
    }

    // If we're already close to a route point, don't add a duplicate pole
    if (minimumDistance < MIN_POLE_DISTANCE / 2) {
      currentPosition = route[currentRouteIndex];
    } else {
      // Add the last pole as our starting point
      poles.push(currentPosition);
    }
  } else {
    // Add first point as a pole if there's no previous pole
    poles.push(currentPosition);
  }

  // Distance traveled since the last pole
  let distanceSinceLastPole = 0;

  // Process each segment of the route
  for (
    let segmentIndex = Math.max(1, currentRouteIndex);
    segmentIndex < route.length;
    segmentIndex++
  ) {
    const segmentStart = route[segmentIndex - 1];
    const segmentEnd = route[segmentIndex];
    const segmentDistance = getDistance(segmentStart, segmentEnd);

    // Skip tiny segments
    if (segmentDistance < 1) continue;

    // Check if the current point is a maneuver point
    const isCurrentPointManeuver = maneuverIndices.includes(segmentIndex - 1);
    const isNextPointManeuver = maneuverIndices.includes(segmentIndex);

    // If starting from a maneuver point, always place a pole there
    if (
      isCurrentPointManeuver &&
      segmentIndex === Math.max(1, currentRouteIndex)
    ) {
      // Only add if it's not too close to the last pole
      const distanceFromLastPole =
        poles.length > 0
          ? getDistance(poles.at(-1), segmentStart)
          : Number.POSITIVE_INFINITY;

      if (distanceFromLastPole > MIN_POLE_DISTANCE / 2) {
        poles.push(segmentStart);
        distanceSinceLastPole = 0;
      }
    }

    const bearing = getBearing(segmentStart, segmentEnd);

    // How far we've moved along the current segment
    let distanceAlongSegment = 0;

    // Process until we've covered the entire segment
    while (distanceAlongSegment < segmentDistance) {
      // Special case: If we're approaching a maneuver point and haven't yet placed a pole there
      if (
        isNextPointManeuver &&
        distanceAlongSegment + IDEAL_POLE_DISTANCE > segmentDistance
      ) {
        // Place pole exactly at the maneuver point
        poles.push(segmentEnd);
        distanceSinceLastPole = 0;
        break;
      }

      // Normal pole placement logic
      const distanceNeeded = IDEAL_POLE_DISTANCE - distanceSinceLastPole;

      if (distanceAlongSegment + distanceNeeded <= segmentDistance) {
        // Move to the position where the next pole should be placed
        distanceAlongSegment += distanceNeeded;

        // Calculate the position for the new pole
        const newPolePosition = computeDestinationPoint(
          segmentStart,
          distanceAlongSegment,
          bearing,
        );

        // Add the new pole
        poles.push(newPolePosition);

        // Reset the distance counter
        distanceSinceLastPole = 0;
      } else {
        // We can't place a pole in this segment, so accumulate the distance and move to the next segment
        distanceSinceLastPole += segmentDistance - distanceAlongSegment;
        break;
      }
    }
  }

  return poles;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const EstimasiService = {
  getEstimasi(route: RouteRequest) {
    try {
      const steps = route.routes[0].legs[0].steps;

      // Array to hold all decoded coordinates for visualization
      const allSegments: { latitude: number; longitude: number }[] = [];

      // Array to hold all poles
      const allPoles: { latitude: number; longitude: number }[] = [];

      // Array to hold all maneuver locations across all steps
      const allManeuverLocations: [number, number][] = [];

      // Last pole placed in the previous step
      let lastPole = null;

      // First collect all maneuver locations
      for (const step of steps) {
        // Add maneuver location to the array
        if (
          step.maneuver &&
          step.maneuver.location &&
          step.maneuver.modifier != 'uturn' &&
          step.maneuver.modifier != 'straight' &&
          step.maneuver.type != 'depart' &&
          step.maneuver.type != 'arrive'
        ) {
          allManeuverLocations.push(step.maneuver.location);
          console.log(
            `Maneuver location: [${step.maneuver.location[0]}, ${step.maneuver.location[1]}], type: ${step.maneuver.type}`,
          );
        }
      }

      let isSkipped = false;

      // Process each step in the route
      for (const [index, step] of steps.entries()) {
        // Decode the geometry for this step
        const decodedSegment = decodeRoute(step.geometry);

        // Skip if segment is empty or invalid
        if (!decodedSegment || decodedSegment.length < 2) continue;

        // Log step information for debugging
        console.log(
          `Processing step: ${step.name}, points: ${decodedSegment.length}`,
        );

        // Extract maneuver location for this step
        const stepManeuverLocation = step.maneuver?.location;
        const nextStepManeuverModifier = steps[index + 1].maneuver?.modifier;

        if (nextStepManeuverModifier == 'uturn') {
          isSkipped = true;

          continue;
        }

        // Create an array of maneuver locations that are relevant to this step
        const relevantManeuvers: [number, number][] = [];

        if (isSkipped) {
          let minimumDistance = Number.POSITIVE_INFINITY;

          let closestIndex = 0;

          for (const [index, point] of decodedSegment.entries()) {
            if (getDistance(point, lastPole) < minimumDistance) {
              minimumDistance = getDistance(point, lastPole);
              closestIndex = index;
            }
          }

          decodedSegment.splice(0, closestIndex);

          isSkipped = false;
        } else {
          if (stepManeuverLocation) {
            relevantManeuvers.push(stepManeuverLocation);
          }
        }

        // Add to all segments for visualization
        allSegments.push(...decodedSegment);

        // Place poles along this segment, ensuring poles are placed at maneuver points
        const stepPoles = placePoles(
          decodedSegment,
          lastPole,
          relevantManeuvers,
        );
        console.log(`Placed ${stepPoles.length} poles in step`);

        // Update the last pole for the next step
        if (stepPoles.length > 0) {
          lastPole = stepPoles.at(-1);
        }

        // Add poles to the overall collection
        allPoles.push(...stepPoles);
      }

      // Remove duplicate poles
      const uniquePoles = removeDuplicates(allPoles);

      // Debug overall results
      console.log(`Total route points: ${allSegments.length}`);
      console.log(`Total maneuver points: ${allManeuverLocations.length}`);
      console.log(`Total poles placed: ${uniquePoles.length}`);

      // If less than 2 poles added, throw an error
      if (uniquePoles.length < 2) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'Not enough poles placed for estimation',
        );
      }

      // Return the result
      return {
        poles: uniquePoles,
        segments: allSegments,
        maneuverPoints: allManeuverLocations.map(location => ({
          latitude: location[0],
          longitude: location[1],
        })),
        totalPoles: uniquePoles.length,
        totalDistance: getPathLength(allSegments),
      };
    } catch (error) {
      console.error('Error in pole estimation:', error);

      throw error;
    }
  },
};
