import {
  Badge,
  Caption,
  Cell,
  Section,
  Skeleton,
} from '@telegram-apps/telegram-ui';
import dayjs from 'dayjs';
import { type FC } from 'react';

import { type Lesson, LessonStatus } from '../model/types';

interface StudentLessonListProps {
  date: Date;
  lessons?: Lesson[];
  isLoading: boolean;
  onRowClicked: (lesson: Lesson) => void;
}

export const StudentLessonList: FC<StudentLessonListProps> = (props) => {
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
              lesson.status === LessonStatus.PENDING ? 'primary' : 'critical'
            }
          />
        }
        onClick={handleRowClicked}
      >
        {lesson.status === LessonStatus.BOOKED
          ? 'Слот занят'
          : 'Ожидает подтверждения'}
      </Cell>
    );
  };

  return (
    <div>
      <Section.Header large>
        {dayjs(date).format('dddd, D MMM YYYY')}
      </Section.Header>

      {isLoading && !lessons?.length && (
        <Skeleton
          className={'h-50 w-full after:rounded-2xl before:rounded-2xl'}
          visible
        />
      )}

      {!lessons?.length && !isLoading && (
        <div className={'mt-4'}>
          <Caption
            className={'block text-center text-[var(--tgui--hint_color)]'}
          >
            На этот день нет расписания занятий
          </Caption>
        </div>
      )}

      <Section>{lessons?.map(renderRow)}</Section>
    </div>
  );
};
