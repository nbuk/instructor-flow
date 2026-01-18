import { Injectable } from '@nestjs/common';

import {
  ForbiddenException,
  NotFoundException,
} from '@/libs/exceptions/exceptions';
import { UserAuthInfo } from '@/modules/auth/types';

import { AccessPolicy } from '../policies/access.policy';
import { StudentRepository } from '../repositories/student.repository';

interface UpdateStudentProfileData {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
}

@Injectable()
export class UpdateStudentProfileUseCase {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly accessPolicy: AccessPolicy,
  ) {}

  async execute(
    userActor: UserAuthInfo,
    studentId: string,
    data: UpdateStudentProfileData,
  ) {
    const student = await this.studentRepository.findById(studentId);
    if (!student) throw new NotFoundException('student not found');
    const allowed = this.accessPolicy.canStudentManage(userActor, student);
    if (!allowed) throw new ForbiddenException('forbidden');

    student
      .setFirstName(data.firstName)
      .setLastName(data.lastName)
      .setPhone(data.phone);
    if (data.middleName) student.setMiddleName(data.middleName);
    await this.studentRepository.save(student);
  }
}
