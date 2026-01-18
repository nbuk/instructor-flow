import { List } from '@telegram-apps/telegram-ui';
import { type FC } from 'react';
import { useNavigate } from 'react-router';

import { useAccount, UserRole } from '@/entities/account';
import {
  StudentProfileForm,
  type StudentProfileSchema,
  useUpdateStudentProfile,
} from '@/features/student';
import { BackButton } from '@/shared/ui/BackButton';

const StudentProfilePage: FC = () => {
  const { data: accountData } = useAccount<UserRole.STUDENT>();
  const navigate = useNavigate();
  const { handleUpdateProfile, isPending } = useUpdateStudentProfile();

  const handleUpdate = (data: StudentProfileSchema) => {
    handleUpdateProfile(
      { ...data, studentId: accountData?.profile.studentId ?? '' },
      () => {
        navigate(-1);
      },
    );
  };

  return (
    <>
      <BackButton />
      <List>
        <StudentProfileForm
          profile={accountData?.profile}
          onSubmit={handleUpdate}
          isSubmitting={isPending}
        />
      </List>
    </>
  );
};

export default StudentProfilePage;
