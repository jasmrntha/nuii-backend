import prisma from '../config/prisma';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Mailer = {
  async findUserEmail(userEmail: string) {
    return await prisma.accounts.findUnique({
      where: {
        email: userEmail,
      },
      select: {
        id: true,
        email: true,
        name: true,
        is_email_verified: true,
      },
    });
  },

  async verifyEmail(userId: string) {
    await prisma.accounts.update({
      where: {
        id: userId,
      },
      data: {
        is_email_verified: true,
      },
    });
  },
};
