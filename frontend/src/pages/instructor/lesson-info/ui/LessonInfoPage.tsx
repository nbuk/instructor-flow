import { Button, Cell, List, Section, Title } from '@telegram-apps/telegram-ui';
import { popup } from '@tma.js/sdk-react';
import dayjs from 'dayjs';
import { type FC } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useLessonInfo } from '@/entities/lesson';
import { useCancelRequest, useDeleteLesson } from '@/features/lesson';
import { shortName } from '@/shared/lib/short-name';
import { BackButton } from '@/shared/ui/BackButton';

const LessonInfoPage: FC = () => {
  const params = useParams();
  const { data } = useLessonInfo(params.lessonId);
  const navigate = useNavigate();
  const { handleCancelRequest, isPending: isCancelPending } =
    useCancelRequest();
  const { handleDeleteLesson, isPending: isDeletePending } = useDeleteLesson();

  if (!data) return <>Loading...</>;
  const startDate = dayjs(data.startAt);

  const handleCancel = async () => {
    if (!data.request) return;

    const buttonId = await popup.show({
      title: 'Отмена записи',
      message: 'Вы уверены, что хотите отменить запись ученика?',
      buttons: [
        { type: 'cancel', id: 'cancel' },
        { type: 'ok', id: 'ok' },
      ],
    });
    if (buttonId !== 'ok') return;

    handleCancelRequest({ slotId: data.id, requestId: data.request.id });
  };

  const handleDelete = async () => {
    const buttonId = await popup.show({
      title: 'Удалить занятие',
      message: 'Вы уверены, что хотите удалить занятие?',
      buttons: [
        { type: 'cancel', id: 'cancel' },
        { type: 'ok', id: 'ok' },
      ],
    });
    if (buttonId !== 'ok') return;

    handleDeleteLesson(data, () => {
      navigate(-1);
    });
  };

  const renderStudentInfo = () => {
    if (!data.request?.student) return null;
    const { firstName, middleName, lastName, phone } = data.request.student;

    return (
      <List>
        <Section header={'Ученик'}>
          <Cell subhead={'Имя'}>
            {shortName(firstName, middleName, lastName)}
          </Cell>
          <Cell subhead={'Номер телефона'}>{phone}</Cell>
        </Section>
      </List>
    );
  };

  return (
    <>
      <BackButton />

      <List>
        <div className={'flex flex-col items-center'}>
          <Title weight={'1'} level={'3'}>
            Информация о занятии
          </Title>
        </div>
      </List>

      <List>
        <Section header={startDate.format('dddd, D MMM YYYY')}>
          <Cell subhead={'Время'}>{startDate.format('HH:mm')}</Cell>
        </Section>
      </List>

      {renderStudentInfo()}

      <List>
        {data.request && (
          <Button
            stretched
            mode={'gray'}
            onClick={handleCancel}
            loading={isCancelPending}
          >
            Отменить запись
          </Button>
        )}

        <Button
          stretched
          mode={'gray'}
          disabled={!!data.request}
          onClick={handleDelete}
          loading={isDeletePending}
        >
          Удалить занятие
        </Button>
      </List>
    </>
  );
};

export default LessonInfoPage;
