import { InlineButtons, List, Section } from '@telegram-apps/telegram-ui';
import dayjs from 'dayjs';
import { type FC, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { useAccount, UserRole } from '@/entities/account';
import {
  InstructorLessonList,
  type Lesson,
  useLessons,
} from '@/entities/lesson';
import { appRoutes } from '@/shared/configs/router';
import {
  Calendar,
  type CalendarDateValue,
} from '@/shared/ui/components/Calendar';
import { ActionsIcon } from '@/shared/ui/icons/ActionsIcon';
import { AddCircle } from '@/shared/ui/icons/AddCircle';

const InstructorSchedulePage: FC = () => {
  const { data: accountData } = useAccount<UserRole.INSTRUCTOR>();
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
  const navigate = useNavigate();

  const handleChange = (value: CalendarDateValue) => {
    if (value instanceof Date) {
      const date = dayjs(value).startOf('day').toDate();
      setActiveDate(date);
      setSearchParams({ date: date.toDateString() });
    }
  };

  const handleCreateLesson = () => {
    navigate(appRoutes.instructor.schedule.createLesson(activeDate));
  };

  const handleCreateByTemplate = () => {
    navigate(appRoutes.instructor.schedule.createByTemplate);
  };

  const handleRowClicked = (lesson: Lesson) => {
    navigate(appRoutes.instructor.schedule.lesson(lesson.id));
  };

  return (
    <List>
      <Section>
        <Calendar
          value={activeDate}
          onChange={handleChange}
          minDate={new Date()}
          prev2Label={null}
          next2Label={null}
        />
      </Section>

      <InlineButtons className={'my-4'} mode={'gray'}>
        <InlineButtons.Item
          text={'Добавить занятие'}
          onClick={handleCreateLesson}
        >
          <AddCircle />
        </InlineButtons.Item>
        <InlineButtons.Item
          text={'Добавить по шаблону'}
          onClick={handleCreateByTemplate}
        >
          <ActionsIcon />
        </InlineButtons.Item>
      </InlineButtons>

      <InstructorLessonList
        date={activeDate}
        lessons={data}
        isLoading={isLoading}
        onRowClicked={handleRowClicked}
      />
    </List>
  );
};

export default InstructorSchedulePage;
