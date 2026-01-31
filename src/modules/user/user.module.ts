import { Module } from '@nestjs/common';

import { ActionTokenModule } from '@/modules/action-token';
import { AuthModule } from '@/modules/auth';
import { UserIntegrationModule } from '@/modules/integration/user';
import { PrismaModule } from '@/modules/prisma/prisma.module';

import { BotUpdate } from './controllers/bot.update';
import { InstructorsController } from './controllers/instructors.controller';
import { StudentsController } from './controllers/students.controller';
import { UsersController } from './controllers/users.controller';
import { AccessPolicy } from './policies/access.policy';
import { InstructorRepository } from './repositories/instructor.repository';
import { StudentRepository } from './repositories/student.repository';
import { StudentReadRepository } from './repositories/student-read.repository';
import { UserUnitOfWork } from './repositories/unit-of-work';
import { UserRepository } from './repositories/user.repository';
import { userUseCases } from './use-cases';
import { UserInviteService } from './user-invite.service';

@Module({
  imports: [PrismaModule, UserIntegrationModule, AuthModule, ActionTokenModule],
  providers: [
    UserRepository,
    InstructorRepository,
    StudentRepository,
    StudentReadRepository,
    UserUnitOfWork,
    BotUpdate,
    AccessPolicy,
    UserInviteService,
    ...userUseCases,
  ],
  controllers: [UsersController, InstructorsController, StudentsController],
  exports: [],
})
export class UserModule {}
