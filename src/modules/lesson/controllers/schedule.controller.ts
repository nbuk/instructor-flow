import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';

import { User } from '@/modules/auth/decorators/user.decorator';
import { InstructorGuard } from '@/modules/auth/guards/instructor.guard';
import type { UserAuthInfo } from '@/modules/auth/types';
import { CreateScheduleDto } from '@/modules/lesson/controllers/dtos/create-schedule.dto';
import { UserRole } from '@/modules/user/domain/entities/user';

import { ApproveLessonRequestUseCase } from '../use-cases/approve-lesson-request.use-case';
import { CancelLessonRequestUseCase } from '../use-cases/cancel-lesson-request.use-case';
import { CreateLessonSlotUseCase } from '../use-cases/create-lesson-slot.use-case';
import { CreateScheduleFromTemplateUseCase } from '../use-cases/create-schedule-from-template.use-case';
import { DeleteLessonSlotUseCase } from '../use-cases/delete-lesson-slot.use-case';
import { GetInstructorLessonRequestsUseCase } from '../use-cases/get-instructor-lesson-requests.use-case';
import { GetInstructorScheduleUseCase } from '../use-cases/get-instructor-schedule.use-case';
import { GetLessonInfoUseCase } from '../use-cases/get-lesson-info.use-case';
import { GetStudentUpcomingLessonsUseCase } from '../use-cases/get-student-lessons.use-case';
import { GetStudentScheduleUseCase } from '../use-cases/get-student-schedule.use-case';
import { LessonRequestUseCase } from '../use-cases/lesson-request.use-case';
import { RejectLessonRequestUseCase } from '../use-cases/reject-lesson-request.use-case';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { GetScheduleDto } from './dtos/get-schedule.dto';
import {
  InstructorLessonResponse,
  StudentLessonResponse,
} from './dtos/lesson.response';
import { LessonRequestResponse } from './dtos/lesson-request.response';

@Controller('schedule')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ScheduleController {
  constructor(
    private readonly createLessonSlotUseCase: CreateLessonSlotUseCase,
    private readonly deleteLessonSlotUseCase: DeleteLessonSlotUseCase,
    private readonly getInstructorScheduleUseCase: GetInstructorScheduleUseCase,
    private readonly getStudentScheduleUseCase: GetStudentScheduleUseCase,
    private readonly getInstructorPendingRequests: GetInstructorLessonRequestsUseCase,
    private readonly getLessonInfo: GetLessonInfoUseCase,
    private readonly lessonRequest: LessonRequestUseCase,
    private readonly approveLessonRequest: ApproveLessonRequestUseCase,
    private readonly rejectLessonRequest: RejectLessonRequestUseCase,
    private readonly cancelLessonRequest: CancelLessonRequestUseCase,
    private readonly getStudentLessons: GetStudentUpcomingLessonsUseCase,
    private readonly createScheduleFromTempalte: CreateScheduleFromTemplateUseCase,
  ) {}

  @Get('instructors/:instructorId')
  async getSchedule(
    @Query() dto: GetScheduleDto,
    @User() user: UserAuthInfo,
    @Param('instructorId') instructorId: string,
  ) {
    const date = dayjs.tz(dto.date, dto.tz);
    const start = date.startOf('day').utc().toDate();
    const end = date.endOf('day').utc().toDate();

    if (user.role === UserRole.INSTRUCTOR) {
      const lessons = await this.getInstructorScheduleUseCase.execute(
        instructorId,
        start,
        end,
      );
      return plainToInstance(InstructorLessonResponse, lessons);
    }

    const lessons = await this.getStudentScheduleUseCase.execute(
      user.id,
      instructorId,
      start,
      end,
    );
    return plainToInstance(StudentLessonResponse, lessons);
  }

  @Get('students/:studentId')
  async getStudentUpcomingLessons(
    @User('id') userId: string,
    @Param('studentId') studentId: string,
    @Query('timezone') timezone: string,
  ) {
    const lessons = await this.getStudentLessons.execute(
      userId,
      studentId,
      timezone,
    );
    return plainToInstance(
      StudentLessonResponse,
      lessons.map((l) => l.serialize()),
    );
  }

  @Get(':instructorId/requests')
  @UseGuards(InstructorGuard)
  async getInstructorRequests(
    @User('id') userId: string,
    @Param('instructorId') instructorId: string,
  ) {
    const requests = await this.getInstructorPendingRequests.execute(
      userId,
      instructorId,
    );
    return plainToInstance(LessonRequestResponse, requests);
  }

  @Post(':instructorId')
  @UseGuards(InstructorGuard)
  async createLesson(
    @User('id') userId: string,
    @Param('instructorId') instructorId: string,
    @Body() dto: CreateLessonDto,
  ) {
    await this.createLessonSlotUseCase.execute({
      actorId: userId,
      instructorId,
      startAt: new Date(dto.startTime),
      endAt: new Date(dto.endTime),
      timezone: dto.timezone,
    });
    return { error: false, message: 'created' };
  }

  @Post('template/:templateId')
  @UseGuards(InstructorGuard)
  async createScheduleByTemplate(
    @Param('templateId') templateId: string,
    @User('id') userId: string,
    @Body() dto: CreateScheduleDto,
  ) {
    await this.createScheduleFromTempalte.execute({
      actorId: userId,
      templateId,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });
  }

  @Get(':slotId')
  @UseGuards(InstructorGuard)
  async getLesson(@User('id') userId: string, @Param('slotId') slotId: string) {
    const info = await this.getLessonInfo.execute(userId, slotId);
    return plainToInstance(InstructorLessonResponse, info);
  }

  @Post(':slotId/request')
  async requestLesson(
    @User('id') userId: string,
    @Param('slotId') slotId: string,
  ) {
    await this.lessonRequest.execute(userId, slotId);
    return { error: false, message: 'requested' };
  }

  @Post(':slotId/:requestId/approve')
  @UseGuards(InstructorGuard)
  async approveRequest(
    @User('id') userId: string,
    @Param('slotId') slotId: string,
    @Param('requestId') requestId: string,
  ) {
    await this.approveLessonRequest.execute(userId, slotId, requestId);
    return { error: false, message: 'approved' };
  }

  @Post(':slotId/:requestId/reject')
  @UseGuards(InstructorGuard)
  async rejectRequest(
    @User('id') userId: string,
    @Param('slotId') slotId: string,
    @Param('requestId') requestId: string,
  ) {
    await this.rejectLessonRequest.execute(userId, slotId, requestId);
    return { error: false, message: 'rejected' };
  }

  @Post(':slotId/:requestId/cancel')
  @UseGuards(InstructorGuard)
  async cancelRequest(
    @User('id') userId: string,
    @Param('slotId') slotId: string,
    @Param('requestId') requestId: string,
  ) {
    await this.cancelLessonRequest.execute(userId, slotId, requestId);
    return { error: false, message: 'cancelled' };
  }

  @Delete(':slotId')
  @UseGuards(InstructorGuard)
  async deleteLessonSlot(
    @User('id') userId: string,
    @Param('slotId') slotId: string,
  ) {
    await this.deleteLessonSlotUseCase.execute(userId, slotId);
    return { error: false, message: 'deleted' };
  }
}
