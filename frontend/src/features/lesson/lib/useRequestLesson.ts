import { useMutation, useQueryClient } from '@tanstack/react-query';

import { lessonQueries } from '@/entities/lesson';

import { requestLesson } from '../api/request-lesson';

export const useRequestLesson = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({ mutationFn: requestLesson });

  const handleRequestLesson = (
    slotId: string,
    onSuccess?: VoidFunction,
    onError?: VoidFunction,
  ) => {
    mutate(slotId, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [lessonQueries.baseKey],
        });
        onSuccess?.();
      },
      onError: () => {
        onError?.();
      },
    });
  };

  return { handleRequestLesson, isPending };
};
