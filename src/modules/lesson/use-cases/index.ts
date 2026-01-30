import { ApproveLessonRequestUseCase } from './approve-lesson-request.use-case';
import { CancelLessonRequestUseCase } from './cancel-lesson-request.use-case';
import { CreateLessonSlotUseCase } from './create-lesson-slot.use-case';
import { CreateScheduleFromTemplateUseCase } from './create-schedule-from-template.use-case';
import { CreateTemplateUseCase } from './create-template.use-case';
import { DeleteLessonSlotUseCase } from './delete-lesson-slot.use-case';
import { DeleteTemplateUseCase } from './delete-template.use-case';
import { GetInstructorLessonRequestsUseCase } from './get-instructor-lesson-requests.use-case';
import { GetInstructorScheduleUseCase } from './get-instructor-schedule.use-case';
import { GetInstructorTemplateInfoUseCase } from './get-instructor-template-info.use-case';
import { GetInstructorTemplatesUseCase } from './get-instructor-templates.use-case';
import { GetLessonInfoUseCase } from './get-lesson-info.use-case';
import { GetStudentUpcomingLessonsUseCase } from './get-student-lessons.use-case';
import { GetStudentScheduleUseCase } from './get-student-schedule.use-case';
import { LessonRequestUseCase } from './lesson-request.use-case';
import { RejectLessonRequestUseCase } from './reject-lesson-request.use-case';
import { UpdateTemplateUseCase } from './update-template.use-case';

export const lessonUseCases = [
  LessonRequestUseCase,
  ApproveLessonRequestUseCase,
  CancelLessonRequestUseCase,
  RejectLessonRequestUseCase,
  CreateLessonSlotUseCase,
  GetInstructorScheduleUseCase,
  GetLessonInfoUseCase,
  DeleteLessonSlotUseCase,
  GetStudentScheduleUseCase,
  GetInstructorLessonRequestsUseCase,
  GetStudentUpcomingLessonsUseCase,
  CreateTemplateUseCase,
  CreateScheduleFromTemplateUseCase,
  GetInstructorTemplatesUseCase,
  GetInstructorTemplateInfoUseCase,
  UpdateTemplateUseCase,
  DeleteTemplateUseCase,
];
