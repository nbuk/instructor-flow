import {
  ButtonCell,
  Cell,
  IconButton,
  Section,
} from '@telegram-apps/telegram-ui';
import { Icon28AddCircle } from '@telegram-apps/telegram-ui/dist/icons/28/add_circle';
import { type ChangeEvent, type FC, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { deepEqual } from '@/shared/lib/deep-equal';
import { transformInputTime } from '@/shared/lib/transform-input-time';
import { RHFInput } from '@/shared/ui/components/rhf/RHFInput';
import { CancelIcon } from '@/shared/ui/icons/CancelIcon';

import type { TemplateFormSchema } from '../../model/template-form.schema';
import { BreakModal } from './BreakModal';

export const DefaultRules: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { setValue, getValues } = useFormContext<TemplateFormSchema>();
  const { fields, append, remove } = useFieldArray<TemplateFormSchema>({
    name: 'defaultRules.breaks',
  });

  // Sync helper: propagate a single field from unifiedRules to every rules[i]
  const syncRulesField = (
    key: 'startTime' | 'endTime' | 'slotDurationMinutes' | 'slotGapMinutes',
    value: string | number,
  ) => {
    const defaults = getValues('defaultRules');
    const rules = getValues('rules') ?? [];
    if (!Array.isArray(rules) || rules.length === 0) return;
    const next = rules.map((r) => {
      if (!deepEqual(r, defaults, { ignoreKeys: ['id', 'weekday'] })) {
        return r;
      }
      return { ...r, [key]: value };
    });

    setValue('rules', next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    });
  };

  const parseNumber = (val: string): number => {
    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = transformInputTime(e.target.value);
    syncRulesField('startTime', value);
    setValue('defaultRules.startTime', value);
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = transformInputTime(e.target.value);
    syncRulesField('endTime', value);
    setValue('defaultRules.endTime', value);
  };

  const handleSlotDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const number = parseNumber(e.target.value);
    syncRulesField('slotDurationMinutes', number);
    setValue('defaultRules.slotDurationMinutes', number);
  };

  const handleSlotGapChange = (e: ChangeEvent<HTMLInputElement>) => {
    const number = parseNumber(e.target.value);
    syncRulesField('slotGapMinutes', number);
    setValue('defaultRules.slotGapMinutes', number);
  };

  const handleAddBreak = (startTime: string, endTime: string) => {
    const defaults = getValues('defaultRules');
    const rules = getValues('rules') ?? [];

    for (let i = 0; i < rules.length; i++) {
      const isDefault = deepEqual(rules[i], defaults, {
        ignoreKeys: ['id', 'weekday'],
      });
      if (!isDefault) continue;
      setValue(`rules.${i}.breaks`, [
        ...(rules[i].breaks ?? []),
        { startTime, endTime },
      ]);
    }

    append({ startTime, endTime });
    setIsModalOpen(false);
  };

  const createRemoveHandler = (index: number) => () => {
    const toRemove = fields.at(index);

    const defaults = getValues('defaultRules');
    const rules = getValues('rules') ?? [];

    for (let i = 0; i < rules.length; i++) {
      const isDefault = deepEqual(rules[i], defaults, {
        ignoreKeys: ['id', 'weekday'],
      });
      if (!isDefault) continue;
      const newBreaks = rules[i].breaks.filter(
        (b) =>
          b.startTime !== toRemove?.startTime &&
          b.endTime !== toRemove?.endTime,
      );
      setValue(`rules.${i}.breaks`, newBreaks);
    }

    remove(index);
  };

  return (
    <>
      <Section header={'Начало рабочего дня'}>
        <RHFInput
          name={'defaultRules.startTime'}
          placeholder={'8:30'}
          onChange={handleStartTimeChange}
        />
      </Section>

      <Section header={'Конец рабочего дня'}>
        <RHFInput
          name={'defaultRules.endTime'}
          placeholder={'19:30'}
          onChange={handleEndTimeChange}
        />
      </Section>

      <Section header={'Продолжительность занятия (в минутах)'}>
        <RHFInput
          name={'defaultRules.slotDurationMinutes'}
          placeholder={'90'}
          onChange={handleSlotDurationChange}
        />
      </Section>

      <Section header={'Интервал между занятиями (в минутах)'}>
        <RHFInput
          name={'defaultRules.slotGapMinutes'}
          placeholder={'15'}
          onChange={handleSlotGapChange}
        />
      </Section>

      <Section header={'Перерывы'}>
        {!fields.length && <Cell subtitle={'Нет перерывов'} />}
        {fields.map((field, i) => (
          <Cell
            key={field.id}
            after={
              <IconButton mode={'plain'} onClick={createRemoveHandler(i)}>
                <CancelIcon className={'text-[var(--tgui--hint_color)]'} />
              </IconButton>
            }
          >
            {field.startTime} - {field.endTime}
          </Cell>
        ))}
        <ButtonCell before={<Icon28AddCircle />} onClick={handleOpenModal}>
          Добавить перерыв
        </ButtonCell>
      </Section>

      <BreakModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAdd={handleAddBreak}
      />
    </>
  );
};
