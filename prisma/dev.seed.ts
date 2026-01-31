import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import dotenv from 'dotenv';

import { PrismaClient, UserRole } from '../generated/prisma/client';

dotenv.config();

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: `${process.env.DATABASE_URL}`,
  }),
});

const main = async () => {
  const existedUserAdmin = await prisma.user.findUnique({
    where: { tgId: '5002664088' },
  });
  const existedUserInstructor = await prisma.user.findUnique({
    where: { tgId: '2200221132' },
  });
  const existedUserStudent = await prisma.user.findUnique({
    where: { tgId: '2202886081' },
  });

  let instructorId: string;

  if (!existedUserAdmin) {
    await prisma.user.create({
      data: { tgId: '5002664088', status: 'ACTIVE', role: UserRole.ADMIN },
    });
  }

  if (!existedUserInstructor) {
    const user = await prisma.user.create({
      data: {
        role: UserRole.INSTRUCTOR,
        tgId: '2200221132',
        status: 'ACTIVE',
      },
    });
    const instructor = await prisma.instructor.create({
      data: {
        userId: user.id,
        firstName: 'Алексей',
        middleName: 'Валерьвич',
        lastName: 'Швырев',
        phone: '+7 (999) 999-99-99',
      },
    });
    instructorId = instructor.id;
  }

  if (!existedUserStudent) {
    const user = await prisma.user.create({
      data: {
        role: 'STUDENT',
        tgId: '2202886081',
        status: 'ACTIVE',
      },
    });
    await prisma.student.create({
      data: {
        userId: user.id,
        instructorId: instructorId!,
        firstName: 'Николай',
        middleName: 'Алексеевич',
        lastName: 'Бухарин',
        firstNameNorm: 'николай',
        middleNameNorm: 'алексеевич',
        lastNameNorm: 'бухарин',
        phone: '+7 (999) 999-99-99',
      },
    });
  }
};

main();
