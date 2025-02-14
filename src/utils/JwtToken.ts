import jwt from 'jsonwebtoken';

import { MAIL_CONFIG } from '../config/email.config';
import { JWT } from '../config/jwt.config';

export const generateAccessToken = (payload: object) =>
  jwt.sign(payload, JWT.JWT_SECRET);

export const generateMailVerifyToken = (user_email: string, user_id: string) =>
  jwt.sign({ user_email, user_id }, JWT.JWT_SECRET, {
    expiresIn:
      process.env.NODE_ENV === 'production'
        ? MAIL_CONFIG.production.EMAIL_EXPIRES_IN
        : MAIL_CONFIG.development.EMAIL_EXPIRES_IN,
  });

export function tokenDecode(token: string) {
  return jwt.verify(token, JWT.JWT_SECRET) as {
    user_email: string;
    user_id: string;
    role?: string;
    email?: string;
    id?: string;
  };
}
