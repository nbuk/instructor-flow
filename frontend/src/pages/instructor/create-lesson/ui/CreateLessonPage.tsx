import {
  Caption,
  Headline,
  List,
  Section,
  Title,
} from '@telegram-apps/telegram-ui';
import dayjs from 'dayjs';
import { type ChangeEvent, type FC, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { useCreateLesson } from '@/features/lesson';
import { transformInputTime } from '@/shared/lib/transform-input-time';
import { BackButton } from '@/shared/ui/BackButton';
import { Input } from '@/shared/ui/Input';
import { MainButton } from '@/shared/ui/MainButton';

const CreateLessonPage: FC = () => {
  const [searchParams] = useSearchParams();
  const date = dayjs(searchParams.get('date'));
  const navigate = useNavigate();

  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('90');

  const { handleCreateLesson } = useCreateLesson();

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const time = transformInputTime(value);
    setTime(time);
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (!value) setDuration(value);
    const duration = Number(value);
    if (!duration) return;
    setDuration(value);
  };

  const handleSave = () => {
    const [hour, minutes] = time.split(':');
    const startTime = date
      .set('hour', Number(hour))
      .set('minutes', Number(minutes))
      .toDate();
    const endTime = dayjs(startTime).add(Number(duration), 'minutes').toDate();
    handleCreateLesson({ startTime, endTime }, () => {
      navigate(-1);
    });
  };

  return (
    <>
      <BackButton />
      <List>
        <div className={'flex flex-col items-center'}>
          <Title weight={'1'} level={'3'}>
            Новое занятие
          </Title>
          <Caption>{date.format('dddd, D MMM YYYY')}</Caption>
        </div>
      </List>

      <List>
        <div>
          <Headline className={'mb-2'} plain={false}>
            Время начала
          </Headline>
          <Section>
            <Input
              placeholder={'12:00'}
              type={'tel'}
              header={'Время начала занятия'}
              value={time}
              onChange={handleTimeChange}
            />
          </Section>
        </div>
        <div>
          <Headline className={'mb-2'} plain={false}>
            Продолжительность в минутах
          </Headline>
          <Section>
            <Input
              placeholder={'90'}
              type={'number'}
              header={'Продолжительность в минутах'}
              value={duration}
              onChange={handleDurationChange}
            />
          </Section>
        </div>
      </List>

      <MainButton
        text={'Сохранить'}
        disabled={!time || !duration}
        onClick={handleSave}
      />
    </>
  );
};

export default CreateLessonPage;
