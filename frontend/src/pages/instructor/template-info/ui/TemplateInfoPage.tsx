import { Button, List, Skeleton, Title } from '@telegram-apps/telegram-ui';
import { popup } from '@tma.js/sdk-react';
import { type FC } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useAccount, UserRole } from '@/entities/account';
import { useInstructorTemplateInfo } from '@/entities/template';
import {
  TemplateForm,
  type TemplateFormSchema,
  useDeleteTemplate,
  useUpdateTemplate,
} from '@/features/template';
import { useHapticFeedback } from '@/shared/hooks/useHapticFeedback';
import { BackButton } from '@/shared/ui/BackButton';

const TemplateInfoPage: FC = () => {
  const { data: accountData } = useAccount<UserRole.INSTRUCTOR>();
  const params = useParams();
  const templateId = params.templateId ?? '';
  const { data, isLoading } = useInstructorTemplateInfo({
    instructorId: accountData?.profile.instructorId ?? '',
    templateId: templateId ?? '',
  });
  const { handleUpdateTemplate, isPending: isUpdatePending } =
    useUpdateTemplate();
  const { handleDeleteTemplate, isPending: isDeletePending } =
    useDeleteTemplate();
  const navigate = useNavigate();
  const haptic = useHapticFeedback();

  const handleUpdate = (data: TemplateFormSchema) => {
    handleUpdateTemplate(
      {
        ...data,
        templateId,
        instructorId: accountData?.profile.instructorId ?? '',
      },
      () => {
        navigate(-1);
      },
    );
  };

  const handleDelete = async () => {
    haptic.notificationOccurred('warning');
    const buttonId = await popup.show({
      title: 'Удалить шаблон',
      message: 'Вы уверены, что хотите удалить шаблон?',
      buttons: [
        { type: 'ok', id: 'ok' },
        { type: 'cancel', id: 'cancel' },
      ],
    });
    if (buttonId !== 'ok') return;

    handleDeleteTemplate(
      { instructionId: accountData?.profile.instructorId ?? '', templateId },
      () => {
        navigate(-1);
      },
    );
  };

  return (
    <List>
      <BackButton />
      <Title className={'text-center !mb-10'} weight={'1'} level={'3'}>
        Редактирование шаблона
      </Title>

      {isLoading ? (
        <Skeleton
          className={'w-full h-[500px] after:rounded-2xl before:rounded-2xl'}
          visible
        />
      ) : (
        <>
          <TemplateForm
            template={data}
            isPending={isUpdatePending}
            onSubmit={handleUpdate}
          />

          <Button
            className={'mt-10 !text-[var(--tgui--destructive_text_color)]'}
            mode={'outline'}
            loading={isDeletePending}
            stretched
            onClick={handleDelete}
          >
            Удалить шаблон
          </Button>
        </>
      )}
    </List>
  );
};

export default TemplateInfoPage;
