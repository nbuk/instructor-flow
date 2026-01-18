import { useMutation, useQueryClient } from '@tanstack/react-query';

import { accountQueries } from '@/entities/account';
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
        onSuccess?.();
      },
      onError: () => {
        onError?.();
        toast.error('Произошла ошибка');
      },
    });
  };

  return { handleUpdateProfile, isPending };
};
