import { Injectable, NotFoundException } from '@nestjs/common';

import { ForbiddenException } from '@/libs/exceptions/exceptions';
import { UserAuthInfo } from '@/modules/auth/types';

import { AccessPolicy } from '../policies/access.policy';
import { InstructorRepository } from '../repositories/instructor.repository';

interface UpdateInstructorProfileParams {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  car: {
    model: string;
    licensePlate: string;
  };
}

@Injectable()
export class UpdateInstructorProfileUseCase {
  constructor(
    private readonly instructorRepository: InstructorRepository,
    private readonly accessPolicy: AccessPolicy,
  ) {}

  async execute(
    userActor: UserAuthInfo,
    instructorId: string,
    data: UpdateInstructorProfileParams,
  ) {
    const instructor = await this.instructorRepository.findById(instructorId);
    if (!instructor) throw new NotFoundException('instructor not found');
    const allowed = this.accessPolicy.canInstructorManage(
      userActor,
      instructor,
    );
    if (!allowed) throw new ForbiddenException('forbidden');

    instructor
      .setCarInfo(data.car.model, data.car.licensePlate)
      .setFirstName(data.firstName)
      .setLastName(data.lastName)
      .setPhone(data.phone);
    if (data.middleName) instructor.setMiddleName(data.middleName);
    await this.instructorRepository.save(instructor);
  }
}
