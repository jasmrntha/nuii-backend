/* eslint-disable @typescript-eslint/naming-convention */

import prisma from '../config/prisma';

export const ExcelArchive = {
    async createData(file_name: string, file_path: string, survey_header_id?: number) {
        return await prisma.excelArchive.create({
            data: {
                file_name,
                file_path,
                survey_header_id,
            },
        });
    }
}