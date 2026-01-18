import { List } from '@telegram-apps/telegram-ui';
import { type FC } from 'react';
import { useNavigate } from 'react-router';

import { useAccount, UserRole } from '@/entities/account';
import {
  InstructorProfileForm,
  type InstructorProfileSchema,
  useUpdateInstructorProfile,
} from '@/features/instructor';
import { BackButton } from '@/shared/ui/BackButton';

const InstructorProfilePage: FC = () => {
  const { data: accountData } = useAccount<UserRole.INSTRUCTOR>();
  const { handleUpdateProfile } = useUpdateInstructorProfile();
  const navigate = useNavigate();

  const handleUpdate = (data: InstructorProfileSchema) => {
    handleUpdateProfile(
      { ...data, instructorId: accountData?.profile.instructorId ?? '' },
      () => {
        navigate(-1);
      },
    );
  };

  return (
    <List>
      <BackButton />
      <InstructorProfileForm
        profile={accountData?.profile}
        onSubmit={handleUpdate}
      />
    </List>
  );
};

export default InstructorProfilePage;
