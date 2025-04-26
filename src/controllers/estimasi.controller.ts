import { Readable, pipeline } from 'node:stream';
import { createGzip } from 'node:zlib';

import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse, CustomError } from '../middleware';
import { type RouteRequest } from '../models';
import { EstimasiService } from '../services';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const EstimasiController = {
  // async getEstimasi(request: Request, response: Response, next: NextFunction) {
  //   try {
  //     const result = await EstimasiService.getEstimasi(
  //       request.body as RouteRequest,
  //     );

  //     const resp = new CustomResponse(
  //       StatusCodes.OK,
  //       'Estimation data fetched',
  //       result,
  //     );

  //     return response.json(resp.toJSON());
  //   } catch (error: any) {
  //     next(error);
  //   }
  // },

  async getEstimasi(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await EstimasiService.getEstimasi(
        request.body as RouteRequest,
      );

      const resp = new CustomResponse(
        StatusCodes.OK,
        'Estimation data fetched',
        result,
      );

      const json = JSON.stringify(resp.toJSON());

      response.setHeader('Content-Type', 'application/json');
      response.setHeader('Content-Encoding', 'gzip');

      const stream = Readable.from([json]);
      const gzip = createGzip();

      pipeline(stream, gzip, response, error => {
        if (error) {
          throw new CustomError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Failed to compress response',
          );
        }
      });
    } catch (error: any) {
      next(error);
    }
  },
};
