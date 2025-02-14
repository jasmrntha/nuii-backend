import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../middleware';
import { Mailer } from '../repositories';
import { generateMailVerifyToken, tokenDecode } from '../utils/JwtToken';
import { mailVerifyContent } from '../utils/MailerComponent';
import { mailQueue } from '../utils/MailProcess';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MailService = {
  async sendVerificationMail(userEmail: string) {
    try {
      const user = await Mailer.findUserEmail(userEmail);

      if (!user) {
        throw new CustomError(StatusCodes.BAD_REQUEST, 'Email is not exist');
      }

      if (user.is_email_verified) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'Email is already verified',
        );
      }

      const mailToken = generateMailVerifyToken(user.email, user.id);
      const mailOptions = mailVerifyContent(user.email, user.name, mailToken);

      const sendMail = new mailQueue();
      await sendMail.send(mailOptions);
    } catch (error) {
      throw error;
    }
  },

  async resendVerifyEmail(userEmail: string) {
    try {
      const user = await Mailer.findUserEmail(userEmail);

      if (!user) {
        throw new CustomError(StatusCodes.BAD_REQUEST, 'Email is not exist');
      }

      if (user.is_email_verified) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'Email is already verified',
        );
      }

      const mailToken = generateMailVerifyToken(user.email, user.id);
      const mailOptions = mailVerifyContent(user.email, user.name, mailToken);

      const sendMail = new mailQueue();
      await sendMail.send(mailOptions);
    } catch (error) {
      throw error;
    }
  },

  async emailVerify(mailToken: string) {
    try {
      const tokenData = tokenDecode(mailToken);

      if (!tokenData) {
        throw new CustomError(StatusCodes.BAD_REQUEST, 'Invalid token');
      }

      const user = await Mailer.findUserEmail(tokenData.user_email);

      if (!user) {
        throw new CustomError(StatusCodes.BAD_REQUEST, 'User is not exist');
      }

      if (user.is_email_verified) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          'Email is already verified',
        );
      }

      await Mailer.verifyEmail(user.id);
    } catch (error) {
      throw error;
    }
  },
};
