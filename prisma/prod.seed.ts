import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import dotenv from 'dotenv';

import { UserRole } from '@/modules/user/domain/entities/user';

import { PrismaClient } from '../generated/prisma/client';

dotenv.config();

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: `${process.env.DATABASE_URL}`,
  }),
});

const main = async () => {
  const ADMIN_TG_ID = process.env.ADMIN_TG_ID;
  if (!ADMIN_TG_ID) return;
  const existedUserAdmin = await prisma.user.findUnique({
    where: { tgId: ADMIN_TG_ID },
  });

  if (!existedUserAdmin) {
    await prisma.user.create({
      data: {
        role: UserRole.ADMIN,
        tgId: ADMIN_TG_ID,
        status: 'ACTIVE',
      },
    });
  }
};

main();
