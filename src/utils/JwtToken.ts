import jwt, {
  type Secret,
  type SignOptions,
  type JwtPayload,
} from 'jsonwebtoken';

import { MAIL_CONFIG } from '../config/email.config';
import { JWT } from '../config/jwt.config';

// ✅ Ensure JWT secret is typed correctly
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const JWT_SECRET: Secret = JWT.JWT_SECRET as string;

// ✅ Access token — no expiry
export const generateAccessToken = (payload: object): string =>
  jwt.sign(payload, JWT_SECRET);

// ✅ Mail verify token — includes expiry
export const generateMailVerifyToken = (
  user_email: string,
  user_id: string,
): string => {
  const options: SignOptions = {
    expiresIn:
      process.env.NODE_ENV === 'production'
        ? MAIL_CONFIG.production.EMAIL_EXPIRES_IN
        : MAIL_CONFIG.development.EMAIL_EXPIRES_IN,
  };

  return jwt.sign({ user_email, user_id }, JWT_SECRET, options);
};

// ✅ Decode / verify token safely
export function tokenDecode(token: string): JwtPayload & {
  user_email?: string;
  user_id?: string;
  role?: string;
  email?: string;
  id?: string;
} {
  return jwt.verify(token, JWT_SECRET) as JwtPayload & {
    user_email?: string;
    user_id?: string;
    role?: string;
    email?: string;
    id?: string;
  };
}
