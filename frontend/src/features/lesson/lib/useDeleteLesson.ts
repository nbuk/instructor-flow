import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { type Lesson, lessonQueries } from '@/entities/lesson';
import { useToast } from '@/shared/ui/components/Toast';

import { deleteLesson } from '../api/delete-lesson';

export const useDeleteLesson = () => {
  const { mutate, isPending } = useMutation({ mutationFn: deleteLesson });
  const queryClient = useQueryClient();
  const toast = useToast();

  const handleDeleteLesson = (
    lesson: Lesson,
    onSuccess?: VoidFunction,
    onError?: VoidFunction,
  ) => {
    mutate(lesson.id, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            lessonQueries.baseKey,
            dayjs(lesson.startAt).startOf('day').toDate(),
          ],
        });
        onSuccess?.();
      },
      onError: () => {
        onError?.();
        toast.error('Произошла ошибка');
      },
    });
  };

  return { handleDeleteLesson, isPending };
};
