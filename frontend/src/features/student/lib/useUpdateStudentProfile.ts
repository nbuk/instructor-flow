import { useMutation, useQueryClient } from '@tanstack/react-query';

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
        toast.error('Произошла ошибка');
      },
    });
  };

  return { handleUpdateProfile, isPending };
};
