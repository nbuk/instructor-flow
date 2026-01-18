import { useMutation, useQueryClient } from '@tanstack/react-query';

import { accountQueries } from '@/entities/account';

import { updateProfile } from '../api/update-profile';
import type {
  InstructorProfileSchema,
  StudentProfileSchema,
} from '../model/update-profile.schema';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
  });

  const handleUpdateProfile = (
    params: InstructorProfileSchema | StudentProfileSchema,
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
