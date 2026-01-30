import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Caption,
  List,
  Section,
  Title,
} from '@telegram-apps/telegram-ui';
import { type FC } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import { useAccount, UserRole } from '@/entities/account';
import { useInstructorTemplates } from '@/entities/template';
import { useCreateScheduleByTemplate } from '@/features/lesson';
import { appRoutes } from '@/shared/configs/router';
import { BackButton } from '@/shared/ui/BackButton';
import {
  type CalendarDateValue,
  DateRangePicker,
} from '@/shared/ui/components/Calendar';
import { MainButton } from '@/shared/ui/MainButton';
import { Select } from '@/shared/ui/Select';

import { scheduleByTemplateSchema } from '../model/create-schedule.schema';

const CreateScheduleByTemplatePage: FC = () => {
  const { data: accountData } = useAccount<UserRole.INSTRUCTOR>();
  const { data, isLoading } = useInstructorTemplates(
    accountData?.profile.instructorId ?? '',
  );
  const { handleCreateSchedule, isPending } = useCreateScheduleByTemplate();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(scheduleByTemplateSchema),
    defaultValues: {
      templateId: '',
      startDate: new Date(),
      endDate: null,
    },
  });
  const { register, setValue, control } = form;
  const startDate = useWatch({ name: 'startDate', control });
  const endDate = useWatch({ name: 'endDate', control });

  const handleDateRangeChange = (value: CalendarDateValue) => {
    if (Array.isArray(value)) {
      setValue('startDate', value[0]);
      setValue('endDate', value[1]);
    }
  };

  const handleCreate = form.handleSubmit(
    (data) => {
      const { startDate, endDate, templateId } = data;
      if (startDate === null || endDate === null) return;
      handleCreateSchedule({ startDate, endDate, templateId }, () => {
        navigate(-1);
      });
    },
    (errors) => console.error(errors),
  );

  return (
    <List>
      <BackButton />

      <Title className={'text-center'} weight={'1'} level={'3'}>
        Создать расписание по шаблону
      </Title>

      {!isLoading && !data?.length ? (
        <div className={'mt-10 flex flex-col gap-6 items-center'}>
          <Caption className={'text-[var(--tg-theme-hint-color)]'}>
            У вас пока нет созданных шаблонов
          </Caption>
          <Link to={appRoutes.instructor.settings.templates.create}>
            <Button size={'m'}>Создать шаблон</Button>
          </Link>
        </div>
      ) : (
        <>
          <Section header={'Шаблон'}>
            <Select {...register('templateId')}>
              {data?.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.title}
                </option>
              ))}
            </Select>
          </Section>

          <Section.Header className={'!mb-0'}>Даты</Section.Header>
          <DateRangePicker
            minDate={new Date()}
            value={[startDate, endDate]}
            onChange={handleDateRangeChange}
            showLeadingZeros={true}
            calendarProps={{
              prev2Label: null,
              next2Label: null,
            }}
          />

          <MainButton
            text={'Создать'}
            disabled={!isLoading && !data?.length}
            onClick={handleCreate}
            isLoading={isPending}
          />
        </>
      )}
    </List>
  );
};

export default CreateScheduleByTemplatePage;
