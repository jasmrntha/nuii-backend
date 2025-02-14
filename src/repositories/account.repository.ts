import prisma from '../config/prisma';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Accounts = {
  async createAccount(email: string, password: string, name: string) {
    return await prisma.accounts.create({
      data: {
        email,
        password,
        name,
      },
    });
  },

  async findAccountByEmail(email: string) {
    return await prisma.accounts.findUnique({
      where: {
        email,
      },
    });
  },
};
