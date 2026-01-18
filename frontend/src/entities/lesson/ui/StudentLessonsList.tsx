import { Badge, Cell, Section } from '@telegram-apps/telegram-ui';
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

  if (isLoading) {
    return <>Loading...</>;
  }

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
        {/*{lesson.isBookedByCurrentUser*/}
        {/*  ? lesson.status === LessonStatus.BOOKED*/}
        {/*    ? 'Вы записаны'*/}
        {/*    : 'Запись забронирована'*/}
        {/*  : 'Уже занято'}*/}
      </Cell>
    );
  };

  return (
    <div>
      <Section.Header large>
        {dayjs(date).format('dddd, D MMM YYYY')}
      </Section.Header>

      {!lessons?.length && (
        <Section.Footer centered>
          На этот день нет расписания занятий
        </Section.Footer>
      )}

      <Section>{lessons?.map(renderRow)}</Section>
    </div>
  );
};
