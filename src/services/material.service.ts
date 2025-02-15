import { LogType } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import prisma from '../config/prisma';
import { CustomError } from '../middleware';
import {
  type UpdateMaterialRequest,
  type CreateMaterialRequest,
} from '../models';
import { Material, TipeMaterial, Logging } from '../repositories';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MaterialService = {
  async createMaterial(request: CreateMaterialRequest) {
    try {
      const tipeMaterial = await TipeMaterial.findTipeMaterialById(
        request.id_tipe_material,
      );

      if (!tipeMaterial) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Tipe Material Not Found');
      }

      const { result } = await prisma.$transaction(async prisma => {
        const result = await Material.createMaterial(
          {
            id_tipe_material: request.id_tipe_material,
            nomor_material: request.nomor_material,
            nama_material: request.nama_material,
            satuan_material: request.satuan,
            berat_material: request.berat,
            harga_material: request.harga_material,
            pasang_rab: request.pasang_rab,
            bongkar: request.bongkar,
            jenis_material: request.jenis_material,
            kategori_material: request.kategori_material,
          },
          prisma,
        );

        await Logging.createLog(
          LogType.Create,
          {
            id_material: result.id,
            id_tipe_material: result.id_tipe_material,
            nomor_material: result.nomor_material,
            nama_material: result.nama_material,
            satuan_material: result.satuan_material,
            berat_material: result.berat_material,
            harga_material: result.harga_material,
            pasang_rab: result.pasang_rab,
            bongkar: result.bongkar,
            jenis_material: result.jenis_material,
            kategori_material: result.kategori_material,
          },
          prisma,
        );

        return { result };
      });

      return result;
    } catch (error) {
      throw error;
    }
  },
  async updateMaterial(id: string, request: UpdateMaterialRequest) {
    try {
      const tipeMaterial = await TipeMaterial.findTipeMaterialById(
        request.id_tipe_material,
      );

      if (!tipeMaterial) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Tipe Material Not Found');
      }

      const material = await Material.findMaterialById(id);

      if (!material) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Material Not Found');
      }

      const { updatedMaterial } = await prisma.$transaction(async prisma => {
        const updatedMaterial = await Material.updateMaterial(
          id,
          {
            id_tipe_material: request.id_tipe_material,
            nomor_material: request.nomor_material,
            nama_material: request.nama_material,
            satuan_material: request.satuan,
            berat_material: request.berat,
            harga_material: request.harga_material,
            pasang_rab: request.pasang_rab,
            bongkar: request.bongkar,
            jenis_material: request.jenis_material,
            kategori_material: request.kategori_material,
          },
          prisma,
        );

        await Logging.createLog(
          LogType.Update,
          {
            id_material: updatedMaterial.id,
            id_tipe_material: updatedMaterial.id_tipe_material,
            nomor_material: updatedMaterial.nomor_material,
            nama_material: updatedMaterial.nama_material,
            satuan_material: updatedMaterial.satuan_material,
            berat_material: updatedMaterial.berat_material,
            harga_material: updatedMaterial.harga_material,
            pasang_rab: updatedMaterial.pasang_rab,
            bongkar: updatedMaterial.bongkar,
            jenis_material: updatedMaterial.jenis_material,
            kategori_material: updatedMaterial.kategori_material,
          },
          prisma,
        );

        return { updatedMaterial };
      });

      return updatedMaterial;
    } catch (error) {
      throw error;
    }
  },
  async deleteMaterial(id: string) {
    try {
      const material = await Material.findMaterialById(id);

      if (!material) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Material Not Found');
      }

      const { deletedMaterial } = await prisma.$transaction(async prisma => {
        const deletedMaterial = await Material.deleteMaterial(id, prisma);

        await Logging.createLog(
          LogType.Delete,
          {
            id_material: deletedMaterial.id,
            id_tipe_material: deletedMaterial.id_tipe_material,
            nomor_material: deletedMaterial.nomor_material,
            nama_material: deletedMaterial.nama_material,
            satuan_material: deletedMaterial.satuan_material,
            berat_material: deletedMaterial.berat_material,
            harga_material: deletedMaterial.harga_material,
            pasang_rab: deletedMaterial.pasang_rab,
            bongkar: deletedMaterial.bongkar,
            jenis_material: deletedMaterial.jenis_material,
            kategori_material: deletedMaterial.kategori_material,
          },
          prisma,
        );

        return { deletedMaterial };
      });

      return deletedMaterial;
    } catch (error) {
      throw error;
    }
  },
};
