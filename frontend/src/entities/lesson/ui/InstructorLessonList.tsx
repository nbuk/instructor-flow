import {
  Badge,
  Caption,
  Cell,
  Section,
  Skeleton,
} from '@telegram-apps/telegram-ui';
import dayjs from 'dayjs';
import { Activity, type FC } from 'react';

import { shortName } from '@/shared/lib/short-name';

import { type Lesson, LessonStatus } from '../model/types';

interface LessonListProps {
  date: Date;
  lessons?: Lesson[];
  isLoading: boolean;
  onRowClicked: (lesson: Lesson) => void;
}

export const InstructorLessonList: FC<LessonListProps> = (props) => {
  const { date, lessons, isLoading, onRowClicked } = props;

  const renderRow = (lesson: Lesson) => {
    const startTime = dayjs(lesson.startAt).format('HH:mm');
    const endTime = dayjs(lesson.endAt).format('HH:mm');

    const handleRowClicked = () => {
      onRowClicked(lesson);
    };

    if (lesson.status === LessonStatus.FREE) {
      return (
        <Cell
          key={lesson.id}
          subhead={`${startTime} - ${endTime}`}
          subtitle={'Запись свободна'}
          onClick={handleRowClicked}
        />
      );
    }

    return (
      <Cell
        key={lesson.id}
        subhead={`${startTime} - ${endTime}`}
        titleBadge={
          <Badge
            type={'dot'}
            mode={
              lesson.status === LessonStatus.PENDING ? 'primary' : undefined
            }
          />
        }
        onClick={handleRowClicked}
      >
        {lesson.request?.student ? (
          <>
            {shortName(
              lesson.request.student.firstName,
              lesson.request.student.middleName,
              lesson.request.student.lastName,
            )}
          </>
        ) : (
          <>Есть запрос</>
        )}
      </Cell>
    );
  };

  return (
    <div>
      <Section.Header large>
        {dayjs(date).format('dddd, D MMM YYYY')}
      </Section.Header>

      <Activity mode={isLoading ? 'visible' : 'hidden'}>
        <Skeleton
          className={'h-50 before:rounded-2xp after:rounded-2xl'}
          visible
        />
      </Activity>

      <Activity mode={!lessons?.length && !isLoading ? 'visible' : 'hidden'}>
        <div className={'mt-4'}>
          <Caption
            className={'block text-center text-[var(--tgui--hint_color)]'}
            weight={'3'}
            level={'1'}
          >
            На этот день нет расписания занятий
          </Caption>
        </div>
      </Activity>

      <Section>{lessons?.map(renderRow)}</Section>
    </div>
  );
};
