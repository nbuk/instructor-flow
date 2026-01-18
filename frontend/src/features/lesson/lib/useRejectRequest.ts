import { useMutation, useQueryClient } from '@tanstack/react-query';

import { lessonQueries } from '@/entities/lesson';

import { rejectRequest, type RejectRequestParams } from '../api/reject-request';

export const useRejectRequest = () => {
  const { mutate, isPending } = useMutation({ mutationFn: rejectRequest });
  const queryClient = useQueryClient();

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
      },
    });
  };

  return { handleRejectRequest, isPending };
};
