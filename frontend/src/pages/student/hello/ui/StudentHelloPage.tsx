import { List } from '@telegram-apps/telegram-ui';
import { type FC } from 'react';
import { useNavigate } from 'react-router';

import { useAccount, UserRole } from '@/entities/account';
import {
  StudentProfileForm,
  type StudentProfileSchema,
  useUpdateStudentProfile,
} from '@/features/student';
import { appRoutes } from '@/shared/configs/router';

const StudentHelloPage: FC = () => {
  const { data: accountData } = useAccount<UserRole.STUDENT>();
  const { handleUpdateProfile, isPending } = useUpdateStudentProfile();
  const navigate = useNavigate();

  const handleUpdate = (data: StudentProfileSchema) => {
    handleUpdateProfile(
      {
        ...data,
        studentId: accountData?.profile.studentId ?? '',
      },
      () => {
        navigate(appRoutes.student.schedule);
      },
    );
  };

  return (
    <List>
      <StudentProfileForm onSubmit={handleUpdate} isSubmitting={isPending} />
    </List>
  );
};

export default StudentHelloPage;
