import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  updateStudentProfile,
  type UpdateStudentProfileParams,
} from '../api/update-student-profile';

export const useUpdateStudentProfile = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateStudentProfile,
  });

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
        onSuccess?.();
      },
      onError: () => {
        onError?.();
      },
    });
  };

  return { handleUpdateProfile, isPending };
};
