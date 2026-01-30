import {
  ButtonCell,
  Cell,
  List,
  Navigation,
  Section,
  Skeleton,
} from '@telegram-apps/telegram-ui';
import { Icon28AddCircle } from '@telegram-apps/telegram-ui/dist/icons/28/add_circle';
import { type FC } from 'react';
import { useNavigate } from 'react-router';

import { useAccount, UserRole } from '@/entities/account';
import { useInstructorTemplates } from '@/entities/template';
import { appRoutes } from '@/shared/configs/router';
import { BackButton } from '@/shared/ui/BackButton';

const InstructorTemplatesPage: FC = () => {
  const { data: accountData } = useAccount<UserRole.INSTRUCTOR>();
  const { data, isLoading } = useInstructorTemplates(
    accountData?.profile.instructorId ?? '',
  );
  const navigate = useNavigate();

  const createNavigateHandler = (id: string) => () => {
    navigate(appRoutes.instructor.settings.templates.info(id));
  };

  const handleCreateTemplateNavigate = () => {
    navigate(appRoutes.instructor.settings.templates.create);
  };

  return (
    <List>
      <BackButton />

      <Section.Header>Шаблоны</Section.Header>

      {isLoading && (
        <Skeleton
          className={'w-full h-[100px] after:rounded-2xl before:rounded-2xl'}
          visible
        />
      )}

      <Section>
        {data?.map((template) => (
          <Cell
            key={template.id}
            after={<Navigation />}
            onClick={createNavigateHandler(template.id)}
          >
            {template.title}
          </Cell>
        ))}
        <ButtonCell
          before={<Icon28AddCircle />}
          onClick={handleCreateTemplateNavigate}
        >
          Создать шаблон
        </ButtonCell>
      </Section>
    </List>
  );
};

export default InstructorTemplatesPage;
