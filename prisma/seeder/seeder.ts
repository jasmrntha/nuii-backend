import { PrismaClient } from '@prisma/client';
import csv from 'csvtojson';
import * as bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

const salt = bcryptjs.genSaltSync(12);

async function users() {
  const dataUser = await csv().fromFile(__dirname + '/data/users.csv');
  let users = dataUser.map(user => {
    return {
      email: user.email,
      password: bcryptjs.hashSync(user.password, salt),
      role: user.role,
      name: user.name,
      is_email_verified: user.is_email_verified == 'true' ? true : false
    };
  });

  for (const user of users) {
    if (user.role == 'ADMIN') {
      await prisma.accounts.upsert({
        where: {
          email: user.email,
        },
        update: {
          email: user.email,
          is_email_verified: user.is_email_verified,
          password: user.password,
          role: user.role,
          name: user.name,
        },
        create: {
          email: user.email,
          is_email_verified: user.is_email_verified,
          password: user.password,
          role: user.role,
          name: user.name,
        },
      });
    } else {
      await prisma.accounts.upsert({
        where: {
          email: user.email,
        },
        update: {
          email: user.email,
          is_email_verified: user.is_email_verified,
          password: user.password,
          role: user.role,
          name: user.name
        },
        create: {
          email: user.email,
          is_email_verified: user.is_email_verified,
          password: user.password,
          role: user.role,
          name: user.name,
        },
      });
    }
  }
}

const main = async () => {
  await users();
};

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
