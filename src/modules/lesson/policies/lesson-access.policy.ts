import { ForbiddenException, Injectable } from '@nestjs/common';

import { ScheduleTemplateEntity } from '@/modules/lesson/domain/entities/schedule-template/schedule-template.entity';
import { UserRole } from '@/modules/user/domain/entities/user';

import { LessonSlotEntity } from '../domain/entities/lesson/lesson-slot.entity';
import { LessonUserReaderPort } from '../domain/ports/lesson-user-reader.port';

@Injectable()
export class LessonAccessPolicy {
  constructor(private readonly userReaderPort: LessonUserReaderPort) {}

  async canStudentRequestLesson(
    actorUserId: string,
    slot: LessonSlotEntity,
  ): Promise<boolean> {
    const user = await this.getUser(actorUserId);
    if (user.role !== UserRole.STUDENT) return false;
    return slot.getInstructorId() === user.profile.instructorId;
  }

  async canInstructorManage(
    actorUserId: string,
    slot: LessonSlotEntity,
  ): Promise<boolean> {
    const user = await this.getUser(actorUserId);
    if (user.role === UserRole.ADMIN) return true;
    if (user.role !== UserRole.INSTRUCTOR) return false;
    return slot.getInstructorId() === user.profile.id;
  }

  async canInstructorCreate(actorId: string, instructorId: string) {
    const user = await this.getUser(actorId);
    if (user.role !== UserRole.INSTRUCTOR) return false;
    return user.profile.id === instructorId;
  }

  async canGetInstructorRequests(actorUserId: string, instructorId: string) {
    const user = await this.getUser(actorUserId);
    if (user.role === UserRole.ADMIN) return true;
    if (user.role !== UserRole.INSTRUCTOR) return false;
    return user.profile.id === instructorId;
  }

  async canGetInstructorLessons(actorUserId: string, instructorId: string) {
    const user = await this.getUser(actorUserId);
    if (user.role === UserRole.ADMIN) return true;
    if (user.role !== UserRole.STUDENT) return false;
    return user.profile.instructorId === instructorId;
  }

  async canGetStudentLessons(actorUserId: string, studentId: string) {
    const user = await this.getUser(actorUserId);
    if (user.role === UserRole.ADMIN) return true;
    if (user.role !== UserRole.STUDENT) return false;
    return user.profile.id === studentId;
  }

  async canCreateTemplate(actorUserId: string) {
    const user = await this.getUser(actorUserId);
    if (user.role === UserRole.ADMIN) return true;
    return user.role === UserRole.INSTRUCTOR;
  }

  async canCreateScheduleFromTemplate(
    actorUserId: string,
    template: ScheduleTemplateEntity,
  ) {
    const user = await this.getUser(actorUserId);
    if (user.role === UserRole.ADMIN) return true;
    return user.profile.id === template.getInstructorId();
  }

  async canGetInstructorTemplates(actorUserId: string, instructorId: string) {
    const user = await this.getUser(actorUserId);
    if (user.role === UserRole.ADMIN) return true;
    return user.profile.id === instructorId;
  }

  async canGetTemplateInfo(
    actorUserId: string,
    template: ScheduleTemplateEntity,
  ) {
    const user = await this.getUser(actorUserId);
    if (user.role === UserRole.ADMIN) return true;
    return user.profile.id === template.getInstructorId();
  }

  async canUpdateTemplate(
    actorUserId: string,
    template: ScheduleTemplateEntity,
  ) {
    const user = await this.getUser(actorUserId);
    if (user.role === UserRole.ADMIN) return true;
    return user.profile.id === template.getInstructorId();
  }

  private async getUser(userId: string) {
    const user = await this.userReaderPort.getUserInfo(userId);
    if (!user) throw new ForbiddenException('forbidden');
    return user;
  }
}
