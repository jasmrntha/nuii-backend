/* eslint-disable unicorn/filename-case */
/* eslint-disable import/no-default-export */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/prevent-abbreviations */
import { PrismaClient } from '@prisma/client';

declare global {
  var _db: PrismaClient | undefined;
}

if (!global._db) {
  global._db = new PrismaClient();
}

const db: PrismaClient = global._db;

export default db;
