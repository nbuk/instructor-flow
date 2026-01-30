import { List, Title } from '@telegram-apps/telegram-ui';
import { type FC } from 'react';
import { useNavigate } from 'react-router';

import {
  TemplateForm,
  type TemplateFormSchema,
  useCreateTemplate,
} from '@/features/template';
import { BackButton } from '@/shared/ui/BackButton';

const CreateTemplatePage: FC = () => {
  const { handleCreateTemplate, isPending } = useCreateTemplate();
  const navigate = useNavigate();

  const handleCreate = (data: TemplateFormSchema) => {
    handleCreateTemplate(data, () => {
      navigate(-1);
    });
  };

  return (
    <>
      <BackButton />

      <Title className={'text-center !mb-10'} weight={'1'} level={'3'}>
        Создание шаблона
      </Title>

      <List>
        <TemplateForm onSubmit={handleCreate} isPending={isPending} />
      </List>
    </>
  );
};

export default CreateTemplatePage;
