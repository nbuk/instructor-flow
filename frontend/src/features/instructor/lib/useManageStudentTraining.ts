import { useMutation, useQueryClient } from '@tanstack/react-query';

import { instructorQueries } from '@/entities/instructor/api/instructor.queries';
import { useHapticFeedback } from '@/shared/hooks/useHapticFeedback';
import { useToast } from '@/shared/ui/components/Toast';

import {
  manageStudentTraining,
  type ManageStudentTrainingParams,
} from '../api/manage-student-training';

export const useManageStudentTraining = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: manageStudentTraining,
  });
  const queryClient = useQueryClient();
  const toast = useToast();
  const haptic = useHapticFeedback();

  const handleManageStudentTraining = (
    params: ManageStudentTrainingParams,
    onSuccess?: VoidFunction,
  ) => {
    mutate(params, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [instructorQueries.baseKey, 'students'],
        });
        haptic.notificationOccurred('success');
        onSuccess?.();
      },
      onError: () => {
        toast.error('Произошла ошибка');
        haptic.notificationOccurred('error');
      },
    });
  };

  return { handleManageStudentTraining, isPending };
};
