import { Injectable } from '@nestjs/common';

import { AuthUserReaderPort } from '@/modules/auth/ports/auth-user-reader.port';
import { BaseUserAuthInfo, UserAuthInfo } from '@/modules/auth/types';
import { PrismaService } from '@/modules/prisma';
import { UserRole } from '@/modules/user/domain/entities/user';

@Injectable()
export class AuthUserReaderAdapter implements AuthUserReaderPort {
  constructor(private readonly prisma: PrismaService) {}

  async findUser(id: string): Promise<UserAuthInfo | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, tgId: true, role: true, status: true },
    });
    if (!user) return null;
    return this.getInfoByUser(user);
  }

  async findUserByTgId(tgId: string): Promise<UserAuthInfo | null> {
    const user = await this.prisma.user.findUnique({
      where: { tgId },
      select: { id: true, tgId: true, role: true, status: true },
    });
    if (!user) return null;
    return this.getInfoByUser(user);
  }

  private async getInfoByUser(user: BaseUserAuthInfo) {
    if (user.role === UserRole.INSTRUCTOR) {
      const profile = await this.prisma.instructor.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      if (!profile) return null;
      return { ...user, role: user.role, instructorId: profile.id };
    }

    if (user.role === UserRole.STUDENT) {
      const profile = await this.prisma.student.findUnique({
        where: { userId: user.id },
        select: { id: true, instructorId: true },
      });
      if (!profile) return null;
      return {
        ...user,
        role: user.role,
        studentId: profile.id,
        instructorId: profile.instructorId,
      };
    }

    return { ...user, role: user.role };
  }
}
