import { Injectable } from '@nestjs/common';

import { PaginatedQueryParams } from '@/libs/database/repository.base';
import { PrismaService } from '@/modules/prisma';

@Injectable()
export class StudentReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByInstructorId(instructorId: string, params: PaginatedQueryParams) {
    const { limit, offset, search } = params;
    const students = await this.prisma.student.findMany({
      where: {
        instructorId,
        firstName: { not: null },
        middleName: { not: null },
        lastName: { not: null },
        ...(!!search && {
          OR: [
            { firstNameNorm: { contains: search.toLowerCase() } },
            { middleNameNorm: { contains: search.toLowerCase() } },
            { lastNameNorm: { contains: search.toLowerCase() } },
          ],
        }),
      },
      include: { user: { select: { status: true } } },
      orderBy: { lastName: 'asc' },
      take: limit,
      skip: offset,
    });
    const totalCount = await this.prisma.student.count({
      where: { instructorId },
    });
    return {
      limit,
      offset,
      totalCount,
      data: students,
    };
  }
}
