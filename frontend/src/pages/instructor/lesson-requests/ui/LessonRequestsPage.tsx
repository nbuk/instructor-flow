import {
  Banner,
  Button,
  Caption,
  List,
  Skeleton,
  Title,
} from '@telegram-apps/telegram-ui';
import dayjs from 'dayjs';
import { Activity, type FC } from 'react';

import { useAccount, UserRole } from '@/entities/account';
import {
  type PendingLessonRequest,
  useLessonsRequests,
} from '@/entities/lesson';
import { useApproveRequest, useRejectRequest } from '@/features/lesson';
import { shortName } from '@/shared/lib/utils';

const LessonRequestsPage: FC = () => {
  const { data: accountData } = useAccount<UserRole.INSTRUCTOR>();
  const { data, isLoading } = useLessonsRequests(
    accountData?.profile.instructorId ?? '',
  );

  const { handleRejectRequest, isPending: isRejectPending } =
    useRejectRequest();
  const { handleApproveRequest, isPending: isApprovePending } =
    useApproveRequest();

  const renderRow = (req: PendingLessonRequest) => {
    const handleApprove = () => {
      handleApproveRequest({ slotId: req.lessonSlot.id, requestId: req.id });
    };

    const handleReject = () => {
      handleRejectRequest({ slotId: req.lessonSlot.id, requestId: req.id });
    };

    return (
      <Banner
        key={req.id}
        className={'!bg-[var(--tgui--section_bg_color)]'}
        type={'inline'}
        callout={dayjs(req.lessonSlot.startAt).format('DD.MM.YY, dddd, HH:mm')}
        header={shortName(
          req.student.firstName,
          req.student.middleName,
          req.student.lastName,
        )}
      >
        <Button
          mode={'filled'}
          size={'s'}
          onClick={handleApprove}
          loading={isRejectPending || isApprovePending}
        >
          Записать
        </Button>
        <Button
          mode={'plain'}
          size={'s'}
          onClick={handleReject}
          loading={isRejectPending || isApprovePending}
        >
          Отказать
        </Button>
      </Banner>
    );
  };

  return (
    <>
      <List>
        <div className={'flex flex-col items-center'}>
          <Title weight={'1'} level={'3'}>
            Запросы на запись
          </Title>
        </div>
      </List>

      {data?.map(renderRow)}

      <Activity mode={isLoading ? 'visible' : 'hidden'}>
        <List>
          {new Array(3).fill('').map((_, i) => (
            <Skeleton
              key={i}
              className={
                'w-100% h-[124px] before:rounded-2xl after:rounded-2xl'
              }
              visible={isLoading}
            />
          ))}
        </List>
      </Activity>

      <Activity mode={!data?.length && !isLoading ? 'visible' : 'hidden'}>
        <div className={'mt-4'}>
          <Caption
            className={'block text-center text-[var(--tgui--hint_color)]'}
          >
            Нет активных запросов на запись
          </Caption>
        </div>
      </Activity>
    </>
  );
};

export default LessonRequestsPage;
