import { useMutation, useQueryClient } from '@tanstack/react-query';

import { templateQueries } from '@/entities/template';
import { useHapticFeedback } from '@/shared/hooks/useHapticFeedback';
import { useToast } from '@/shared/ui/components/Toast';

import {
  deleteTemplate,
  type DeleteTemplateParams,
} from '../api/delete-template';

export const useDeleteTemplate = () => {
  const { mutate, isPending } = useMutation({ mutationFn: deleteTemplate });
  const queryClient = useQueryClient();
  const toast = useToast();
  const haptic = useHapticFeedback();

  const handleDeleteTemplate = (
    params: DeleteTemplateParams,
    onSuccess?: VoidFunction,
  ) => {
    mutate(params, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [templateQueries.baseKey, 'list'],
        });
        onSuccess?.();
      },
      onError: () => {
        haptic.notificationOccurred('error');
        toast.error('При удалении произошла ошибка');
      },
    });
  };

  return { handleDeleteTemplate, isPending };
};
