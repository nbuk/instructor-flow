import { zodResolver } from '@hookform/resolvers/zod';
import { Multiselect, Section } from '@telegram-apps/telegram-ui';
import type { MultiselectOption } from '@telegram-apps/telegram-ui/dist/components/Form/Multiselect/types';
import { type FC, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import type { ScheduleTemplate } from '@/entities/template';
import { useHapticFeedback } from '@/shared/hooks/useHapticFeedback';
import { RHFInput } from '@/shared/ui/components/rhf/RHFInput';
import { useToast } from '@/shared/ui/components/Toast';
import { MainButton } from '@/shared/ui/MainButton';

import {
  getDefaultValues,
  type TemplateFormSchema,
  templateFormSchema,
} from '../../model/template-form.schema';
import { AccordionRule } from './AccordionRule';
import { DefaultRules } from './DefaultRules';

interface TemplateFormProps {
  template?: ScheduleTemplate;
  isPending: boolean;
  onSubmit: (data: TemplateFormSchema) => void;
}

type MultiSelectOption = {
  value: number;
  label: string;
  fullLabel: string;
};

const SELECT_OPTIONS: MultiSelectOption[] = [
  { value: 1, label: 'Пн', fullLabel: 'Понедельник' },
  { value: 2, label: 'Вт', fullLabel: 'Вторник' },
  { value: 3, label: 'Ср', fullLabel: 'Среда' },
  { value: 4, label: 'Чт', fullLabel: 'Четверг' },
  { value: 5, label: 'Пт', fullLabel: 'Пятница' },
  { value: 6, label: 'Сб', fullLabel: 'Суббота' },
  { value: 0, label: 'Вс', fullLabel: 'Воскресенье' },
];

export const TemplateForm: FC<TemplateFormProps> = (props) => {
  const { template, onSubmit, isPending } = props;

  const toast = useToast();
  const haptic = useHapticFeedback();
  const [selectedDays, setSelectedDays] = useState<MultiSelectOption[]>(
    SELECT_OPTIONS.filter((option) => option.value > 0 && option.value < 6),
  );

  useEffect(() => {
    if (!template) return;
    const selectedDays: MultiSelectOption[] = [];

    for (const rule of template.rules) {
      const option = SELECT_OPTIONS.find(
        (option) => option.value === rule.weekday,
      );
      if (!option) continue;
      selectedDays.push(option);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedDays(selectedDays);
  }, [template]);

  const form = useForm({
    resolver: zodResolver(templateFormSchema),
    defaultValues: getDefaultValues(template),
  });
  const { getValues, setValue } = form;

  const createDefaultRule = (weekday: number) => {
    const unified = getValues('defaultRules');

    const startTime = unified?.startTime ?? '';
    const endTime = unified?.endTime ?? '';
    const slotDurationMinutes = unified?.slotDurationMinutes ?? 90;
    const slotGapMinutes = unified?.slotGapMinutes ?? 0;
    const breaks = (unified?.breaks ?? []).map((b) => ({
      startTime: b.startTime,
      endTime: b.endTime,
    }));

    return {
      startTime,
      endTime,
      breaks,
      slotDurationMinutes,
      slotGapMinutes,
      weekday,
    };
  };

  const handleSelectDays = (options: MultiselectOption[]) => {
    const nextSelected = (options as MultiSelectOption[]).sort((a, b) => {
      if (a.value === 0) return 1;
      if (b.value === 0) return -1;
      return a.value - b.value;
    });

    // Determine added and removed days
    const prevByValue = new Set(selectedDays.map((o) => o.value));
    const nextByValue = new Set(nextSelected.map((o) => o.value));

    const added = nextSelected
      .filter((o) => !prevByValue.has(o.value))
      .map((o) => o.value);
    const removed = selectedDays
      .filter((o) => !nextByValue.has(o.value))
      .map((o) => o.value);

    // Current rules from form state
    const currentRules = getValues('rules') ?? [];

    // Remove rules for deselected days
    const updatedRules = currentRules.filter(
      (r) => !removed.includes(r.weekday),
    );

    // Add rules for newly selected days if not present
    for (const wd of added) {
      const exists = updatedRules.some((r) => r.weekday === wd);
      if (!exists) {
        updatedRules.push(createDefaultRule(wd));
      }
    }

    // Reorder rules to match current selection order
    const orderMap = new Map(nextSelected.map((o, i) => [o.value, i] as const));
    updatedRules.sort(
      (a, b) => (orderMap.get(a.weekday) ?? 0) - (orderMap.get(b.weekday) ?? 0),
    );

    // Update form state and local UI state
    setValue('rules', updatedRules, {
      shouldDirty: true,
      shouldValidate: false,
      shouldTouch: false,
    });
    setSelectedDays(nextSelected);
  };

  const handleSubmit = form.handleSubmit(onSubmit, (errors) => {
    console.log(errors);
    const flattenErrors = (errs: object): string[] =>
      Object.values(errs).flatMap((e) =>
        e?.message ? [e.message] : flattenErrors(e),
      );
    const errMessages = flattenErrors(errors);
    toast.error(errMessages[0]);
    haptic.notificationOccurred('error');
  });

  return (
    <FormProvider {...form}>
      <>
        <div className={'!mb-10'}>
          <Section.Header large>Общие настройки</Section.Header>

          <Section header={'Название шаблона'}>
            <RHFInput name={'title'} placeholder={'Основной'} />
          </Section>

          <DefaultRules />

          <Section header={'Рабочие дни'}>
            <Multiselect
              placeholder={'Выберете рабочие дни'}
              selectedBehavior={'hide'}
              value={selectedDays}
              options={SELECT_OPTIONS}
              onChange={handleSelectDays}
            />
          </Section>
        </div>

        {!!selectedDays.length && (
          <>
            <Section.Header large>Настройки по дням недели</Section.Header>

            {selectedDays.map((s, index) => (
              <AccordionRule
                key={s.value}
                title={s.fullLabel ?? ''}
                index={index}
              />
            ))}
          </>
        )}

        <MainButton
          text={'Сохранить'}
          disabled={isPending}
          onClick={handleSubmit}
        />
      </>
    </FormProvider>
  );
};
