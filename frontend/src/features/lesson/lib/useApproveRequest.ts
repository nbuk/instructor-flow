import { useMutation, useQueryClient } from '@tanstack/react-query';

import { lessonQueries } from '@/entities/lesson';

import {
  approveRequest,
  type ApproveRequestParams,
} from '../api/approve-request';

export const useApproveRequest = () => {
  const { mutate, isPending } = useMutation({ mutationFn: approveRequest });
  const queryClient = useQueryClient();

  const handleApproveRequest = (
    params: ApproveRequestParams,
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

  return { handleApproveRequest, isPending };
};
