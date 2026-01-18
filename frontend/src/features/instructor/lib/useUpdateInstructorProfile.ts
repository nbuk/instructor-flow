import { useMutation, useQueryClient } from '@tanstack/react-query';

import { accountQueries } from '@/entities/account';

import {
  updateInstructorProfile,
  type UpdateInstructorProfileParams,
} from '../api/update-instructor-profile';

export const useUpdateInstructorProfile = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: updateInstructorProfile,
  });
  const queryClient = useQueryClient();

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
      },
    });
  };

  return { handleUpdateProfile, isPending };
};
