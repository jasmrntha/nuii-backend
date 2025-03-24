import { type AuthObject } from '@clerk/express';

declare global {
  namespace Express {
    export interface Request {
      auth: AuthObject;
    }
  }
}

declare module '@mapbox/polyline' {
  const polyline: {
    // eslint-disable-next-line no-unused-vars
    decode: (encoded: string, precision?: number) => number[][];
    // eslint-disable-next-line no-unused-vars
    encode: (coordinates: number[][], precision?: number) => string;
  };
  export = polyline;
}
