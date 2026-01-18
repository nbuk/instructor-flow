import { ChangeStudentStatusUseCase } from './change-student-status.use-case';
import { CreateInstructorUseCase } from './create-instructor.use-case';
import { CreateStudentUseCase } from './create-student.use-case';
import { GetInstructorProfileUseCase } from './get-instructor-profile.use-case';
import { GetInstructorStudentsUseCase } from './get-instructor-students.use-case';
import { GetStudentProfileUseCase } from './get-student-profile.use-case';
import { UpdateInstructorProfileUseCase } from './update-instructor-profile.use-case';
import { UpdateStudentProfileUseCase } from './update-student-profile.use-case';

export const userUseCases = [
  CreateInstructorUseCase,
  CreateStudentUseCase,
  UpdateInstructorProfileUseCase,
  UpdateStudentProfileUseCase,
  GetInstructorStudentsUseCase,
  ChangeStudentStatusUseCase,
  GetInstructorProfileUseCase,
  GetStudentProfileUseCase,
];
