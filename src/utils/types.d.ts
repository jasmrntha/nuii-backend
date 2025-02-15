import { type AuthObject } from '@clerk/express';

declare global {
  namespace Express {
    export interface Request {
      auth: AuthObject;
    }
  }
}
