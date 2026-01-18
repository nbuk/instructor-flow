import { Cell, List, Section } from '@telegram-apps/telegram-ui';
import { type FC } from 'react';

import { useAccount, UserRole } from '@/entities/account';
import { useInstructorProfile } from '@/entities/instructor';
import { normalizePhone } from '@/shared/lib/utils';
import { BackButton } from '@/shared/ui/BackButton';

const StudentInstructorPage: FC = () => {
  const { data: accountData } = useAccount<UserRole.STUDENT>();
  const { data: instructorProfile } = useInstructorProfile(
    accountData?.profile.instructorId,
  );

  return (
    <>
      <BackButton />
      <List>
        <Section.Header>Мой инструктор</Section.Header>
        <Section>
          <Cell subhead={'ФИО'}>
            {instructorProfile?.lastName} {instructorProfile?.firstName}{' '}
            {instructorProfile?.middleName}
          </Cell>
          <Cell subhead={'Номер телефона'}>
            <a href={`tel:${normalizePhone(instructorProfile?.phone ?? '')}`}>
              {instructorProfile?.phone}
            </a>
          </Cell>
          <Cell subhead={'Учебный автомобиль'}>
            {instructorProfile?.car?.model}{' '}
            {instructorProfile?.car?.licensePlate}
          </Cell>
        </Section>
      </List>
    </>
  );
};

export default StudentInstructorPage;
