import { useMutation, useQueryClient } from '@tanstack/react-query';

import { instructorQueries } from '@/entities/instructor/api/instructor.queries';

import {
  manageStudentTraining,
  type ManageStudentTrainingParams,
} from '../api/manage-student-training';

export const useManageStudentTraining = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: manageStudentTraining,
  });
  const queryClient = useQueryClient();

  const handleManageStudentTraining = (
    params: ManageStudentTrainingParams,
    onSuccess?: VoidFunction,
  ) => {
    mutate(params, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [instructorQueries.baseKey, 'students'],
        });
        onSuccess?.();
      },
      onError: () => {},
    });
  };

  return { handleManageStudentTraining, isPending };
};
