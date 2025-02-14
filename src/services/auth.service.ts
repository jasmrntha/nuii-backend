// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';

import database from '../config/connectDb';
import { CustomError } from '../middleware';
import { type LoginRequest, type RegisterRequest } from '../models';
import { Accounts } from '../repositories';
import {
  generateAccessToken,
  generateMailVerifyToken,
  tokenDecode,
} from '../utils/JwtToken';
import { mailVerifyContent } from '../utils/MailerComponent';
import { mailQueue } from '../utils/MailProcess';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AuthService = {
  async register(request: RegisterRequest) {
    try {
      const emailFind = await Accounts.findAccountByEmail(request.email);

      if (emailFind) {
        throw new CustomError(StatusCodes.BAD_REQUEST, 'Email already exist');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(request.password, salt);

      const account = await Accounts.createAccount(
        request.email,
        hashedPassword,
        request.name,
      );

      delete account.password;
      delete account.is_email_verified;
      delete account.created_at;
      delete account.updated_at;

      const mailToken = generateMailVerifyToken(account.email, account.id);
      const mailOptions = mailVerifyContent(
        account.email,
        account.name,
        mailToken,
      );

      const sendMail = new mailQueue();
      await sendMail.send(mailOptions);

      return account;
    } catch (error) {
      throw error;
    }
  },

  async login(request: LoginRequest) {
    const user = await database.accounts.findUnique({
      where: {
        email: request.email,
      },
    });

    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Credentials not found');
    }

    if (!user.is_email_verified) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'Account not verified');
    }

    const isPasswordMatch = bcrypt.compareSync(request.password, user.password);

    if (!isPasswordMatch) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = generateAccessToken(payload);

    return {
      token,
      user_id: user.id,
      nama: user.name,
      email: user.email,
    };
  },

  async selfData(request: string) {
    try {
      const tokenData = tokenDecode(request);
      const selfAccount = await Accounts.findAccountByEmail(tokenData.email);

      if (!selfAccount) {
        throw new CustomError(StatusCodes.BAD_REQUEST, 'Account not found');
      }

      const result = {
        user_id: selfAccount.id,
        nama: selfAccount.name,
        email: selfAccount.email,
      };

      return result;
    } catch (error) {
      throw error;
    }
  },
};
