import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { lessonQueries } from '@/entities/lesson';
import { useToast } from '@/shared/ui/components/Toast';

import { requestLesson } from '../api/request-lesson';

export const useRequestLesson = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({ mutationFn: requestLesson });
  const toast = useToast();

  const handleRequestLesson = (
    slotId: string,
    onSuccess?: VoidFunction,
    onError?: VoidFunction,
  ) => {
    mutate(slotId, {
      onSuccess: async () => {
        onSuccess?.();
      },
      onError: (e) => {
        if (e instanceof AxiosError) {
          if (e.response?.status === 409) {
            toast.error('Произошла ошибка. Возможно слот уже забронирован.');
            return;
          }
        }
        toast.error('Произошла ошибка');
        onError?.();
      },
      onSettled: async () => {
        await queryClient.invalidateQueries({
          queryKey: [lessonQueries.baseKey],
        });
      },
    });
  };

  return { handleRequestLesson, isPending };
};
