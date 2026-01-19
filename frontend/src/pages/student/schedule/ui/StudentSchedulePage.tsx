import { List, Section } from '@telegram-apps/telegram-ui';
import { popup } from '@tma.js/sdk-react';
import dayjs from 'dayjs';
import { type FC, useState } from 'react';
import { useSearchParams } from 'react-router';

import { useAccount, UserRole } from '@/entities/account';
import {
  type Lesson,
  LessonStatus,
  StudentLessonList,
  useLessons,
} from '@/entities/lesson';
import { useRequestLesson } from '@/features/lesson';
import { Calendar, type Value } from '@/shared/ui/components/Calendar';

const StudentSchedulePage: FC = () => {
  const { data: accountData } = useAccount<UserRole.STUDENT>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeDate, setActiveDate] = useState(
    dayjs(searchParams.get('date') ?? dayjs().startOf('day').toDate())
      .startOf('day')
      .toDate(),
  );
  const { data, isLoading } = useLessons({
    date: activeDate,
    instructorId: accountData?.profile.instructorId ?? '',
  });
  const { handleRequestLesson } = useRequestLesson();

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      const date = dayjs(value).startOf('day').toDate();
      setActiveDate(date);
      setSearchParams({ date: date.toDateString() });
    }
  };

  const handleRowClicked = async (lesson: Lesson) => {
    if (lesson.status !== LessonStatus.FREE) return;
    const startTime = dayjs(lesson.startAt);
    const promise = popup.show({
      title: `Забронировать занятие в ${startTime.format('HH:mm')}`,
      message: `⚠️⚠️⚠️\nПожалуйста, убедитесь, что у вас оплачено занятие в личном кабинете автошколы.`,
      buttons: [
        { id: 'ok', type: 'default', text: 'Забронировать' },
        { id: 'cancel', type: 'cancel' },
      ],
    });

    const answer = await promise;
    if (answer === 'ok') {
      handleRequestLesson(lesson.id);
    }
  };

  return (
    <List>
      <Section>
        <Calendar
          value={activeDate}
          onChange={handleDateChange}
          minDate={new Date()}
          prev2Label={null}
          next2Label={null}
        />
      </Section>

      <StudentLessonList
        date={activeDate}
        lessons={data}
        isLoading={isLoading}
        onRowClicked={handleRowClicked}
      />
    </List>
  );
};

export default StudentSchedulePage;
