import {
  Button,
  Caption,
  Modal,
  type ModalProps,
  Text,
} from '@telegram-apps/telegram-ui';
import { popup } from '@tma.js/sdk-react';
import { type FC } from 'react';

import { UserStatus } from '@/entities/account';
import type { InstructorStudentProfile } from '@/entities/instructor';
import { useManageStudentTraining } from '@/features/instructor';
import { normalizePhone } from '@/shared/lib/utils';

interface StudentModalProps extends ModalProps {
  student: InstructorStudentProfile | null;
  onClose: VoidFunction;
}

export const StudentModal: FC<StudentModalProps> = (props) => {
  const { student, onClose, ...rest } = props;

  const { handleManageStudentTraining, isPending } = useManageStudentTraining();
  const statusText =
    student?.status === UserStatus.ACTIVE ? 'Закончить' : 'Возобновить';

  const handleManage = async () => {
    if (!student) return;

    const promise = popup.show({
      title: `${statusText} обучение`,
      message: `Вы уверены, что хотите ${statusText.toLowerCase()} обучение ученика?`,
      buttons: [
        { type: 'cancel', id: 'cancel' },
        { type: 'ok', id: 'ok' },
      ],
    });

    const buttonId = await promise;
    if (buttonId !== 'ok') return;

    handleManageStudentTraining(
      {
        studentId: student.id,
        status:
          student.status === UserStatus.ACTIVE
            ? UserStatus.INACTIVE
            : UserStatus.ACTIVE,
      },
      onClose,
    );
  };

  return (
    <Modal open={!!student} {...rest}>
      <div className={'pt-5 px-5 pb-20 flex flex-col gap-4'}>
        <div className={'flex flex-col gap-1'}>
          <Caption className={'text-[var(--tgui--section_header_text_color)]'}>
            ФИО
          </Caption>
          <Text>
            {student?.lastName} {student?.firstName} {student?.middleName}
          </Text>
        </div>
        <div className={'flex flex-col gap-1'}>
          <Caption className={'text-[var(--tgui--section_header_text_color)]'}>
            Номер телефона
          </Caption>
          <a href={`tel:${normalizePhone(student?.phone ?? '')}`}>
            <Text>{student?.phone}</Text>
          </a>
        </div>

        <div className={'h-30 flex flex-col justify-end'}>
          <Button size={'l'} loading={isPending} onClick={handleManage}>
            {statusText} обучение
          </Button>
        </div>
      </div>
    </Modal>
  );
};
