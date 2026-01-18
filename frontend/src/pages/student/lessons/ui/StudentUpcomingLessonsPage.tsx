import {
  Cell,
  List,
  Section,
  Spinner,
  Title,
} from '@telegram-apps/telegram-ui';
import dayjs from 'dayjs';
import { type FC } from 'react';

import { LessonStatus, useStudentUpcomingLessons } from '@/entities/lesson';

const StudentUpcomingLessonsPage: FC = () => {
  const { data, isLoading } = useStudentUpcomingLessons();
  const upcomingLessons = data?.filter((l) => l.status === LessonStatus.BOOKED);
  const pendingLessons = data?.filter((l) => l.status === LessonStatus.PENDING);

  return (
    <List>
      <Title className={'text-center'} weight={'1'} level={'3'}>
        Мои занятия
      </Title>

      {isLoading && (
        <div className={'flex flex-1 justify-center items-center'}>
          <Spinner size={'s'} />
        </div>
      )}

      {!isLoading && !upcomingLessons?.length && !pendingLessons?.length && (
        <Section.Footer centered>Нет предстоящих занятий</Section.Footer>
      )}

      {!!upcomingLessons?.length && (
        <div>
          <Section.Header>Предстоящие занятия</Section.Header>
          <Section>
            {upcomingLessons?.map((lesson) => (
              <Cell key={lesson.id}>
                {dayjs(lesson.startAt).format('DD.MM.YY, dddd, HH:mm')}
              </Cell>
            ))}
          </Section>
        </div>
      )}

      {!!pendingLessons?.length && (
        <div>
          <Section.Header>Ожидают подтверждения</Section.Header>
          <Section>
            {pendingLessons?.map((lesson) => (
              <Cell key={lesson.id}>
                {dayjs(lesson.startAt).format('DD.MM.YY, dddd, HH:mm')}
              </Cell>
            ))}
          </Section>
        </div>
      )}
    </List>
  );
};

export default StudentUpcomingLessonsPage;
