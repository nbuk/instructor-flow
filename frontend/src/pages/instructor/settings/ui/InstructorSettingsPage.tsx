import { Cell, List, Navigation, Section } from '@telegram-apps/telegram-ui';
import { type FC } from 'react';
import { useNavigate } from 'react-router';

import { appRoutes } from '@/shared/configs/router';

const InstructorSettingsPage: FC = () => {
  const navigate = useNavigate();

  const createNavigateHandler = (path: string) => () => {
    navigate(path);
  };

  return (
    <>
      <List>
        <Section.Header>Настройки</Section.Header>
        <Section>
          <Cell
            after={<Navigation />}
            onClick={createNavigateHandler(
              appRoutes.instructor.settings.profile,
            )}
          >
            Профиль
          </Cell>
          <Cell
            after={<Navigation />}
            onClick={createNavigateHandler(
              appRoutes.instructor.settings.students,
            )}
          >
            Ученики
          </Cell>
        </Section>
        <Section.Footer>Версия: v0.0.1</Section.Footer>
      </List>
    </>
  );
};

export default InstructorSettingsPage;
