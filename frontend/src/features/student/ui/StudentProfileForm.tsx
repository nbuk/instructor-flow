import { zodResolver } from '@hookform/resolvers/zod';
import { useMask } from '@react-input/mask';
import { Section } from '@telegram-apps/telegram-ui';
import { type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import type { StudentProfile } from '@/entities/student';
import { Input } from '@/shared/ui/Input';
import { MainButton } from '@/shared/ui/MainButton';

import {
  getDefaultValues,
  type StudentProfileSchema,
  studentProfileSchema,
} from '../model/student-profile.schema';

interface StudentProfileFormProps {
  profile?: StudentProfile;
  submitButtonText?: string;
  isSubmitting: boolean;
  onSubmit: (data: StudentProfileSchema) => void;
}

export const StudentProfileForm: FC<StudentProfileFormProps> = (props) => {
  const {
    profile,
    submitButtonText = 'Сохранить',
    isSubmitting,
    onSubmit,
  } = props;

  const phoneInputRef = useMask({
    mask: '+7 (___) ___-__-__',
    replacement: { _: /\d/ },
  });

  const form = useForm({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: getDefaultValues(profile),
  });

  const { register, formState, control } = form;

  const handleSubmit = form.handleSubmit(
    (data) => {
      onSubmit(data);
    },
    (error) => console.log(error),
  );

  return (
    <>
      <Section.Header>Персональная информация</Section.Header>
      <Section>
        <Input
          header={'Фамилия'}
          placeholder={'Фамилия'}
          status={formState.errors.lastName ? 'error' : 'default'}
          {...register('lastName')}
        />
        <Input
          header={'Имя'}
          placeholder={'Имя'}
          status={formState.errors.firstName ? 'error' : 'default'}
          {...register('firstName')}
        />
        <Input
          header={'Отчество'}
          placeholder={'Отчество'}
          status={formState.errors.middleName ? 'error' : 'default'}
          {...register('middleName')}
        />
        <Controller
          name={'phone'}
          control={control}
          render={({ field }) => (
            <Input
              header={'Номер телефона'}
              placeholder={'Номер телефона'}
              status={formState.errors.phone ? 'error' : 'default'}
              {...field}
              ref={phoneInputRef}
            />
          )}
        />
      </Section>

      <MainButton
        text={submitButtonText}
        onClick={handleSubmit}
        disabled={isSubmitting}
      />
    </>
  );
};
