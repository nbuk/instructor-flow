import { useMutation, useQueryClient } from '@tanstack/react-query';

import { accountQueries } from '@/entities/account';
import { useHapticFeedback } from '@/shared/hooks/useHapticFeedback';
import { useToast } from '@/shared/ui/components/Toast';

import {
  updateInstructorProfile,
  type UpdateInstructorProfileParams,
} from '../api/update-instructor-profile';

export const useUpdateInstructorProfile = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: updateInstructorProfile,
  });
  const queryClient = useQueryClient();
  const toast = useToast();
  const haptic = useHapticFeedback();

  const handleUpdateProfile = (
    params: UpdateInstructorProfileParams,
    onSuccess?: VoidFunction,
    onError?: VoidFunction,
  ) => {
    mutate(params, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [accountQueries.baseKey],
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
