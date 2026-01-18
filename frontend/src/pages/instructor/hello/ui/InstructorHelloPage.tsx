import { List, Title } from '@telegram-apps/telegram-ui';
import { type FC } from 'react';

import { useAccount, UserRole } from '@/entities/account';
import {
  InstructorProfileForm,
  type InstructorProfileSchema,
  useUpdateInstructorProfile,
} from '@/features/instructor';

const InstructorHelloPage: FC = () => {
  const { data: accountData } = useAccount<UserRole.INSTRUCTOR>();
  const { handleUpdateProfile } = useUpdateInstructorProfile();

  const handleUpdate = (data: InstructorProfileSchema) => {
    handleUpdateProfile({
      ...data,
      instructorId: accountData?.profile.instructorId ?? '',
    });
  };

  return (
    <List>
      <Title level={'3'}>Профиль инструктора</Title>
      <InstructorProfileForm onSubmit={handleUpdate} />
    </List>
  );
};

export default InstructorHelloPage;
