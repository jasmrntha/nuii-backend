import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomResponse } from '../middleware';
// import { tokenDecode } from '../utils/JwtToken';
// import { storageQueryValidate } from '../validators';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MaterialController = {
  postMaterial(request: Request, response: Response, next: NextFunction) {
    try {
      console.log(request.auth);

      const resp = new CustomResponse(StatusCodes.OK, 'File uploaded');

      return response.json(resp.toJSON());
    } catch (error: any) {
      next(error);
    }
  },
};
