import { useMutation } from '@tanstack/react-query';

import { useHapticFeedback } from '@/shared/hooks/useHapticFeedback';
import { useToast } from '@/shared/ui/components/Toast';

import {
  createScheduleByTemplate,
  type CreateScheduleByTemplateParams,
} from '../api/create-schedule-by-template';

export const useCreateScheduleByTemplate = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: createScheduleByTemplate,
  });
  const toast = useToast();
  const haptic = useHapticFeedback();

  const handleCreateSchedule = (
    params: CreateScheduleByTemplateParams,
    onSuccess?: VoidFunction,
  ) => {
    mutate(params, {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: () => {
        haptic.notificationOccurred('error');
        toast.error('Произошла ошибка');
      },
    });
  };

  return { handleCreateSchedule, isPending };
};
