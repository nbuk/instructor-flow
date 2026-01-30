import {
  Accordion,
  ButtonCell,
  Cell,
  Divider,
  IconButton,
  Section,
} from '@telegram-apps/telegram-ui';
import { Icon28AddCircle } from '@telegram-apps/telegram-ui/dist/icons/28/add_circle';
import { type ChangeEvent, type FC, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { transformInputTime } from '@/shared/lib/transform-input-time';
import { RHFInput } from '@/shared/ui/components/rhf/RHFInput';
import { CancelIcon } from '@/shared/ui/icons/CancelIcon';

import type { TemplateFormSchema } from '../../model/template-form.schema';
import { BreakModal } from './BreakModal';

interface AccordionRuleProps {
  title: string;
  index: number;
}

export const AccordionRule: FC<AccordionRuleProps> = (props) => {
  const { title, index } = props;

  const [expanded, setExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<TemplateFormSchema>();
  const { fields, append, remove } = useFieldArray<TemplateFormSchema>({
    control,
    name: `rules.${index}.breaks`,
  });

  useEffect(() => {
    const ruleErrors = errors.rules;
    if (!Array.isArray(ruleErrors) || ruleErrors.length === 0) return;
    if (ruleErrors[index]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpanded(true);
      return;
    }
  }, [errors.rules, setExpanded, index]);

  useEffect(() => {
    if (!expanded) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpanded(false);
    setTimeout(() => {
      setExpanded(true);
    }, 0);
  }, [fields, expanded]);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(`rules.${index}.startTime`, transformInputTime(e.target.value));
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(`rules.${index}.endTime`, transformInputTime(e.target.value));
  };

  const handleAddBreak = (startTime: string, endTime: string) => {
    append({ startTime, endTime });
    setIsModalOpen(false);
  };

  const createRemoveBreakHandler = (index: number) => () => {
    remove(index);
  };

  return (
    <Section>
      <Accordion expanded={expanded} onChange={setExpanded}>
        <Accordion.Summary>{title}</Accordion.Summary>
        <Accordion.Content className={'px-2 !bg-transparent'}>
          <Section.Header>Начало рабочего дня</Section.Header>
          <RHFInput
            name={`rules.${index}.startTime`}
            placeholder={'08:30'}
            onChange={handleStartTimeChange}
          />
          <Divider />

          <Section.Header>Конец рабочего дня</Section.Header>
          <RHFInput
            name={`rules.${index}.endTime`}
            placeholder={'19:30'}
            onChange={handleEndTimeChange}
          />
          <Divider />

          <Section.Header>Продолжительность занятия (в минутах)</Section.Header>
          <RHFInput
            name={`rules.${index}.slotDurationMinutes`}
            placeholder={'90'}
            type={'number'}
          />

          <Divider />

          <Section.Header>Интервал между занятиями (в минутах)</Section.Header>
          <RHFInput
            name={`rules.${index}.slotGapMinutes`}
            placeholder={'90'}
            type={'number'}
          />
          <Divider />

          <Section.Header>Перерывы</Section.Header>

          {!fields.length && <Cell subtitle={'Нет перерывов'} />}
          {fields.map((field, i) => (
            <Cell
              key={field.id}
              after={
                <IconButton
                  mode={'plain'}
                  onClick={createRemoveBreakHandler(i)}
                >
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
        </Accordion.Content>
      </Accordion>

      <BreakModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAdd={handleAddBreak}
      />
    </Section>
  );
};
