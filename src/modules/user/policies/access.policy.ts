import { Injectable } from '@nestjs/common';

import { UserAuthInfo } from '@/modules/auth/types';

import { InstructorEntity } from '../domain/entities/instructor';
import { StudentEntity } from '../domain/entities/student';
import { UserRole } from '../domain/entities/user';

@Injectable()
export class AccessPolicy {
  constructor() {}

  canInstructorManage(
    actorUser: UserAuthInfo,
    instructor: InstructorEntity,
  ): boolean {
    if (actorUser.role === UserRole.ADMIN) return true;
    return instructor.getUserId() === actorUser.id;
  }

  canStudentManage(actorUser: UserAuthInfo, student: StudentEntity): boolean {
    if (actorUser.role === UserRole.ADMIN) return true;
    if (actorUser.role === UserRole.INSTRUCTOR)
      return student.getInstructorId() === actorUser.instructorId;
    return student.getUserId() === actorUser.id;
  }

  canGetInstructorProfile(
    actor: UserAuthInfo,
    instructor: InstructorEntity,
  ): boolean {
    if (actor.role === UserRole.ADMIN) return true;
    return actor.instructorId === instructor.getId();
  }

  canGetStudentProfile(actor: UserAuthInfo, student: StudentEntity) {
    if (actor.role === UserRole.ADMIN) return true;
    if (actor.role === UserRole.INSTRUCTOR)
      return student.getInstructorId() === actor.instructorId;
    return actor.studentId === student.getId();
  }

  canGetInstructorStudents(
    actorUser: UserAuthInfo,
    instructor: InstructorEntity,
  ): boolean {
    if (actorUser.role === UserRole.ADMIN) return true;
    return instructor.getUserId() === actorUser.id;
  }

  canAddInstructor(actorUser: UserAuthInfo): boolean {
    return actorUser.role === UserRole.ADMIN;
  }

  canAddStudent(actorUser: UserAuthInfo): boolean {
    if (actorUser.role === UserRole.ADMIN) return true;
    return actorUser.role === UserRole.INSTRUCTOR;
  }
}
