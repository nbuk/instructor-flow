import { Cell, List, Navigation, Section } from '@telegram-apps/telegram-ui';
import { type FC } from 'react';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/shared/configs/router';

const StudentSettingsPage: FC = () => {
  const navigate = useNavigate();

  const createNavigateHandler = (path: string) => () => {
    navigate(path);
  };

  return (
    <List>
      <Section.Header>Настройки</Section.Header>
      <Section>
        <Cell
          after={<Navigation />}
          onClick={createNavigateHandler(
            appRoutes.student.settings.myInstructor,
          )}
        >
          Мой инструктор
        </Cell>
        <Cell
          after={<Navigation />}
          onClick={createNavigateHandler(appRoutes.student.settings.profile)}
        >
          Профиль
        </Cell>
      </Section>
    </List>
  );
};

export default StudentSettingsPage;
