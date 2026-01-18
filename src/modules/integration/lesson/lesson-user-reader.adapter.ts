import { Injectable } from '@nestjs/common';

import {
  InstructorUserInfo,
  LessonUserReaderPort,
  StudentUserInfo,
  UserInfo,
} from '@/modules/lesson/domain/ports/lesson-user-reader.port';
import { PrismaService } from '@/modules/prisma';
import { UserRole } from '@/modules/user/domain/entities/user';

@Injectable()
export class LessonUserReaderAdapter implements LessonUserReaderPort {
  constructor(private readonly prisma: PrismaService) {}

  async getUserInfo(userId: string): Promise<UserInfo | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, tgId: true, role: true },
    });
    if (!user) return null;

    if (user.role === UserRole.ADMIN) {
      return { ...user, role: UserRole.ADMIN };
    }

    if (user.role === UserRole.INSTRUCTOR) {
      const profile = await this.prisma.instructor.findUnique({
        where: { userId: user.id },
        include: { car: true },
      });
      if (!profile) return null;
      return { ...user, role: user.role, profile };
    }

    if (user.role === UserRole.STUDENT) {
      const profile = await this.prisma.student.findUnique({
        where: { userId: user.id },
      });
      if (!profile) return null;
      return { ...user, role: user.role, profile };
    }

    return null;
  }

  async getUserInfoByStudentId(
    studentId: string,
  ): Promise<StudentUserInfo | null> {
    const profile = await this.prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!profile) return null;
    const user = await this.prisma.user.findUnique({
      where: { id: profile.userId },
      select: { id: true, tgId: true, role: true },
    });
    if (!user || user.role !== UserRole.STUDENT) return null;
    return { ...user, role: user.role, profile };
  }

  async getUserInfoByInstructorId(
    instructorId: string,
  ): Promise<InstructorUserInfo | null> {
    const profile = await this.prisma.instructor.findUnique({
      where: { id: instructorId },
      include: { car: true },
    });
    if (!profile) return null;
    const user = await this.prisma.user.findUnique({
      where: { id: profile.userId },
      select: { id: true, tgId: true, role: true },
    });
    if (!user || user.role !== UserRole.INSTRUCTOR) return null;
    return { ...user, role: user.role, profile };
  }
}
