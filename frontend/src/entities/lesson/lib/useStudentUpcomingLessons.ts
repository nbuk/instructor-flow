import { useQuery } from '@tanstack/react-query';

import { useAccount, UserRole } from '@/entities/account';
import { lessonQueries } from '@/entities/lesson';

export const useStudentUpcomingLessons = () => {
  const { data: accountData } = useAccount<UserRole.STUDENT>();
  const { data, isLoading } = useQuery(
    lessonQueries.fetchStudentUpcomingLessons(
      accountData?.profile.studentId ?? '',
    ),
  );

  return { data, isLoading };
};
