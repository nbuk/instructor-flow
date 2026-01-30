import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Divider,
  Modal,
  type ModalProps,
  Section,
} from '@telegram-apps/telegram-ui';
import { mainButton } from '@tma.js/sdk-react';
import { type ChangeEvent, type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { transformInputTime } from '@/shared/lib/transform-input-time';
import { Input } from '@/shared/ui/Input';

import { timeRangeSchema } from '../../model/template-form.schema';

interface BreakModalProps extends ModalProps {
  onAdd: (startTime: string, endTime: string) => void;
}

export const BreakModal: FC<BreakModalProps> = (props) => {
  const { onAdd, ...rest } = props;

  const form = useForm({
    resolver: zodResolver(timeRangeSchema),
    defaultValues: { startTime: '', endTime: '' },
  });

  const {
    register,
    setValue,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (props.open) {
      mainButton.hide();
    } else {
      mainButton.show();
      reset();
    }
  }, [props.open, reset]);

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('startTime', transformInputTime(e.target.value));
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('endTime', transformInputTime(e.target.value));
  };

  const handleAdd = form.handleSubmit((data) => {
    onAdd(data.startTime, data.endTime);
  });

  return (
    <Modal {...rest} header={<Modal.Header>Добавить перерыв</Modal.Header>}>
      <div className={'pt-5 px-5 pb-20'}>
        <Section header={'Начало перерыва'}>
          <Input
            {...register('startTime')}
            placeholder={'12:00'}
            onChange={handleStartTimeChange}
            status={errors.startTime?.message ? 'error' : 'default'}
          />
        </Section>
        <Divider />
        <Section header={'Конец перерыва'}>
          <Input
            {...register('endTime')}
            placeholder={'13:00'}
            onChange={handleEndTimeChange}
            status={errors.endTime?.message ? 'error' : 'default'}
          />
        </Section>
        <Divider />

        <Button
          className={'mt-5'}
          mode={'filled'}
          size={'m'}
          stretched
          onClick={handleAdd}
        >
          Добавить
        </Button>
      </div>
    </Modal>
  );
};
