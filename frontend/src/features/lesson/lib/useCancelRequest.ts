import { useMutation, useQueryClient } from '@tanstack/react-query';

import { lessonQueries } from '@/entities/lesson';

import { cancelRequest, type CancelRequestParams } from '../api/cancel-request';

export const useCancelRequest = () => {
  const { mutate, isPending } = useMutation({ mutationFn: cancelRequest });
  const queryClient = useQueryClient();

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
      },
    });
  };

  return { handleCancelRequest, isPending };
};
