import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useHapticFeedback } from '@/shared/hooks/useHapticFeedback';
import { useToast } from '@/shared/ui/components/Toast';

import {
  updateStudentProfile,
  type UpdateStudentProfileParams,
} from '../api/update-student-profile';

export const useUpdateStudentProfile = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: updateStudentProfile,
  });
  const toast = useToast();
  const haptic = useHapticFeedback();

  const handleUpdateProfile = (
    params: UpdateStudentProfileParams,
    onSuccess?: VoidFunction,
    onError?: VoidFunction,
  ) => {
    mutate(params, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['account'],
        });
        haptic.notificationOccurred('success');
        onSuccess?.();
      },
      onError: () => {
        onError?.();
        toast.error('Произошла ошибка');
        haptic.notificationOccurred('error');
      },
    });
  };

  return { handleUpdateProfile, isPending };
};
