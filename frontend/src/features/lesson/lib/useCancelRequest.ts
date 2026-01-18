import { useMutation, useQueryClient } from '@tanstack/react-query';

import { lessonQueries } from '@/entities/lesson';
import { useToast } from '@/shared/ui/components/Toast';

import { cancelRequest, type CancelRequestParams } from '../api/cancel-request';

export const useCancelRequest = () => {
  const { mutate, isPending } = useMutation({ mutationFn: cancelRequest });
  const queryClient = useQueryClient();
  const toast = useToast();

  const handleCancelRequest = (
    params: CancelRequestParams,
    onSuccess?: VoidFunction,
    onError?: VoidFunction,
  ) => {
    mutate(params, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [lessonQueries.baseKey, params.slotId],
        });
        onSuccess?.();
      },
      onError: () => {
        onError?.();
        toast.error('Произошла ошибка');
      },
    });
  };

  return { handleCancelRequest, isPending };
};
