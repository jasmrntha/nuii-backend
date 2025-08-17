import { StatusCodes } from 'http-status-codes';

import prisma from '../config/prisma';
import { CustomError } from '../middleware';
import {
  type CreateSKTMDetailRequest,
  type UpdateSKTMDetailRequest,
} from '../models';
import {
  SKTMComponent,
  SKTMDetail,
  SKTMJoint,
  SKTMSurvey,
  SurveyHeader,
} from '../repositories';

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6_371_000; // Earth radius in meters
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const Δφ = toRad(lat2 - lat1);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Calculate bearing from point A to B
function bearing(lat1: number, lon1: number, lat2: number, lon2: number) {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const λ1 = toRad(lon1);
  const λ2 = toRad(lon2);

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// Move from lat/lon along a bearing by a distance (meters)
function movePoint(
  lat: number,
  lon: number,
  distance: number,
  bearingDeg: number,
) {
  const R = 6_371_000; // earth radius in meters
  const δ = distance / R; // angular distance
  const θ = toRad(bearingDeg);

  const φ1 = toRad(lat);
  const λ1 = toRad(lon);

  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ),
  );
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2),
    );

  return { lat: toDeg(φ2), lon: toDeg(λ2) };
}

async function insertJointsEveryDistanceInterpolated(
  surveyId: number,
  intervalMeters: number,
  jointMaterialId: number,
  cableMaterialId: number,
  tx: any,
) {
  // 1️⃣ Get survey details and sort by explicit order if available
  const details = await SKTMDetail.getAllBySurvey(surveyId);
  const ordered = details.sort(
    (a, b) => a.created_at.getTime() - b.created_at.getTime(),
  );

  if (ordered.length < 2) return; // not enough points

  // 2️⃣ Get last urutan to continue numbering
  const maxUrutan = await SKTMJoint.getMaxUrutan(surveyId);
  let jointCounter = (maxUrutan ?? 0) + 1;

  let accumulated = 0;
  let lastLat = Number.parseFloat(ordered[0].lat);
  let lastLon = Number.parseFloat(ordered[0].long);

  for (let index = 1; index < ordered.length; index++) {
    const segLat = Number.parseFloat(ordered[index].lat);
    const segLon = Number.parseFloat(ordered[index].long);

    // 3️⃣ Calculate segment length using haversine for accuracy
    let segLength = haversine(lastLat, lastLon, segLat, segLon);

    // Skip tiny movements that could cause bearing instability
    if (segLength < 0.01) {
      lastLat = segLat;
      lastLon = segLon;
      continue;
    }

    let currentLat = lastLat;
    let currentLon = lastLon;

    // 4️⃣ Insert joints as needed along this segment
    while (accumulated + segLength >= intervalMeters) {
      const distanceNeeded = intervalMeters - accumulated;
      const brg = bearing(currentLat, currentLon, segLat, segLon);
      const point = movePoint(currentLat, currentLon, distanceNeeded, brg);

      await SKTMJoint.createJoint(
        {
          id_sktm_survey: surveyId,
          id_material_kabel: cableMaterialId,
          id_material_joint: jointMaterialId,
          lat: point.lat.toString(),
          long: point.lon.toString(),
          urutan: jointCounter++,
        },
        tx,
      );

      // Update for remaining distance in this segment
      currentLat = point.lat;
      currentLon = point.lon;
      segLength -= distanceNeeded;
      accumulated = 0; // reset after placing a connector
    }

    // 5️⃣ Carry leftover distance to next segment
    accumulated += segLength;
    lastLat = segLat;
    lastLon = segLon;
  }
}

async function upsertTerminationKeluar(
  idMaterial: number,
  surveyId: number,
  tx: any,
) {
  const exist = await SKTMComponent.getByMaterial(idMaterial, surveyId);
  const component = exist[0];

  if (component) {
    // Merge logic
    const newKuantitas =
      Number(component.kuantitas) === 1 ? 2 : Number(component.kuantitas);
    const newKeterangan =
      component.keterangan === 'MASUK'
        ? 'MASUK & KELUAR'
        : component.keterangan;

    return SKTMComponent.updateComponents(
      component.id,
      {
        ...component,
        kuantitas: newKuantitas,
        keterangan: newKeterangan,
      },
      tx,
    );
  } else {
    // Create fresh
    return SKTMComponent.createComponent(
      {
        id_sktm_survey: surveyId,
        id_material: idMaterial,
        tipe_material: 'TERMINATION',
        kuantitas: 1,
        keterangan: 'KELUAR',
      },
      tx,
    );
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SKTMService = {
  async createDetail(payload: CreateSKTMDetailRequest) {
    try {
      const {
        id_survey_header: idSurveyHeader,
        id_sktm_survey: idSKTMSurvey,
        id_termination_masuk: idTerminationMasuk,
        id_termination_keluar: idTerminationKeluar,
        id_kabel: idKabel,
        ...cleanDetail
      } = payload;

      const isEmpty = idSKTMSurvey ? false : true;

      const survey = isEmpty
        ? null
        : await SKTMSurvey.getById(idSKTMSurvey, true);

      if (!survey && !isEmpty) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'SKTM Survey not found');
      }

      const header = await SurveyHeader.getById(
        idSurveyHeader,
        'Belum_Disetujui',
      );

      if (
        (idTerminationMasuk || idKabel) &&
        survey?.sktm_details.length > 0 &&
        !isEmpty
      ) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'SKTM Detail already exist, cannot initate a new starting point',
        );
      }

      if (idTerminationKeluar && survey?.sktm_details.length <= 0 && !isEmpty) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'SKTM Detail need to be initiated first',
        );
      }

      if ((idTerminationMasuk || idKabel) && idTerminationKeluar && !isEmpty) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'SKTM Detail cannot be initiated and ended at the same time',
        );
      }

      const { sktm } = await prisma.$transaction(async tx => {
        const sktm = isEmpty
          ? await SKTMSurvey.createSurvey({ id_survey_header: header.id }, tx)
          : survey;

        const details = await SKTMDetail.createDetail(
          { id_sktm_survey: sktm.id, ...cleanDetail },
          tx,
        );

        if (idTerminationMasuk && idKabel) {
          await Promise.all([
            SKTMComponent.createComponent(
              {
                id_sktm_survey: details.id_sktm_survey,
                id_material: idTerminationMasuk,
                tipe_material: 'TERMINATION',
                kuantitas: 1,
                keterangan: 'MASUK',
              },
              tx,
            ),
            SKTMComponent.createComponent(
              {
                id_sktm_survey: details.id_sktm_survey,
                id_material: idKabel,
                tipe_material: 'CABLE',
                kuantitas: details.panjang_jaringan,
              },
              tx,
            ),
          ]);
        } else {
          const cableComponents = await SKTMComponent.getByTipe(
            'CABLE',
            details.id_sktm_survey,
          );

          const cableComponent = cableComponents[0];

          const newLength =
            Number(cableComponent.kuantitas) + details.panjang_jaringan;

          await SKTMComponent.updateComponents(cableComponent.id, {
            id_sktm_survey: cableComponent.id_sktm_survey,
            id_material: cableComponent.id_material,
            tipe_material: cableComponent.tipe_material,
            kuantitas: newLength,
            keterangan: cableComponent.keterangan,
          });
        }

        if (idTerminationKeluar) {
          await upsertTerminationKeluar(
            idTerminationKeluar,
            details.id_sktm_survey,
            tx,
          );

          const cableComponent = await SKTMComponent.getByTipe(
            'CABLE',
            details.id_sktm_survey,
          );

          let jointMaterialId = 0;

          switch (cableComponent[0].id_material) {
            case 138: {
              jointMaterialId = 95;
            }

            case 139: {
              jointMaterialId = 97;
            }
          }

          await insertJointsEveryDistanceInterpolated(
            details.id_sktm_survey,
            20,
            jointMaterialId,
            cableComponent[0].id_material,
            tx,
          );
        }

        const newSktm = await SKTMSurvey.getById(details.id_sktm_survey, true);

        return { sktm: newSktm };
      });

      const resp = {
        ...sktm,
      };

      return resp;
    } catch (error) {
      throw error;
    }
  },

  async createSurvey(id_survey_header: number) {
    try {
      const header = await SurveyHeader.getById(
        id_survey_header,
        'Belum_Disetujui',
      );

      if (!header) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Survey Header not found');
      }

      const { survey } = await prisma.$transaction(async tx => {
        const survey = await SKTMSurvey.createSurvey({ id_survey_header }, tx);

        return { survey };
      });

      return survey;
    } catch (error) {
      throw error;
    }
  },

  async UpdateSKTM(payload: UpdateSKTMDetailRequest) {
    try {
      const survey = await SKTMSurvey.getById(payload.id);

      if (!survey) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'SKTM Survey not found');
      }

      const { updated } = await prisma.$transaction(async tx => {
        // --- check for details ---
        if (payload.details && payload.details.length > 0) {
          for (const detail of payload.details) {
            const { id, ...data } = detail;

            await SKTMDetail.updateDetail(id, data, tx);
          }
        }

        // --- check for components ---
        if (payload.components && payload.components.length > 0) {
          for (const component of payload.components) {
            const { id, ...data } = component;

            await SKTMComponent.updateComponents(id, data, tx);
          }
        }

        // --- check for joints ---
        if (payload.joints && payload.joints.length > 0) {
          for (const joint of payload.joints) {
            const { id, ...data } = joint;

            await SKTMJoint.updateJoint(id, data, tx);
          }
        }

        const updated = await SKTMSurvey.getById(payload.id, true);

        return { updated };
      });

      return updated;
    } catch (error) {
      throw error;
    }
  },

  async deleteEntity(target: string, surveyId: number, entityId?: number) {
    switch (target) {
      case 'survey': {
        return prisma.$transaction(async tx => {
          await SKTMSurvey.deleteSurvey(surveyId, tx);
        });
      }

      case 'detail': {
        return await SKTMDetail.deleteDetail(entityId);
      }

      case 'component': {
        return SKTMComponent.deleteComponents(entityId);
      }

      case 'joint': {
        return SKTMJoint.deleteJoint(entityId);
      }

      default: {
        throw new Error(`Unsupported delete target: ${target}`);
      }
    }
  },

  async getSKTM(id_survey_header: number, details: boolean = false) {
    try {
      const sktm = await SKTMSurvey.getById(id_survey_header, details);

      if (!sktm) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'SKTM Survey not found');
      }

      return sktm;
    } catch (error) {
      throw error;
    }
  },

  async getAllSKTM() {
    try {
      const sktm = await SKTMSurvey.getAll();

      return sktm;
    } catch (error) {
      throw error;
    }
  },
};
