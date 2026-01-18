import { useMutation, useQueryClient } from '@tanstack/react-query';

import { lessonQueries } from '@/entities/lesson';
import { useToast } from '@/shared/ui/components/Toast';

import { rejectRequest, type RejectRequestParams } from '../api/reject-request';

export const useRejectRequest = () => {
  const { mutate, isPending } = useMutation({ mutationFn: rejectRequest });
  const queryClient = useQueryClient();
  const toast = useToast();

  const handleRejectRequest = (
    params: RejectRequestParams,
    onSuccess?: VoidFunction,
    onError?: VoidFunction,
  ) => {
    mutate(params, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [lessonQueries.baseKey, 'requests'],
        });
        onSuccess?.();
      },
      onError: () => {
        onError?.();
        toast.error('Произошла ошибка');
      },
    });
  };

  return { handleRejectRequest, isPending };
};
