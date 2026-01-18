import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useAccount, UserRole } from '@/entities/account';
import { lessonQueries } from '@/entities/lesson';
import { useToast } from '@/shared/ui/components/Toast';

import { createLesson, type CreateLessonParams } from '../api/create-lesson';

export const useCreateLesson = () => {
  const { data: accountData } = useAccount<UserRole.INSTRUCTOR>();
  const { mutate, isPending } = useMutation({ mutationFn: createLesson });
  const queryClient = useQueryClient();
  const toast = useToast();

  const handleCreateLesson = (
    params: Omit<CreateLessonParams, 'instructorId'>,
    onSuccess?: VoidFunction,
    onError?: VoidFunction,
  ) => {
    mutate(
      { ...params, instructorId: accountData?.profile.instructorId ?? '' },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: [lessonQueries.baseKey],
          });
          onSuccess?.();
        },
        onError: (error) => {
          onError?.();
          if (error instanceof AxiosError) {
            if (error.status === 409) {
              toast.error('Занятие пересекается с другими занятиями');
              return;
            }
          }

          toast.error('Произошла ошибка при сохранении');
        },
      },
    );
  };

  return { handleCreateLesson, isPending };
};
