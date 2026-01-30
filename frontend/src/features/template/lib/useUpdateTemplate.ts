import { useMutation, useQueryClient } from '@tanstack/react-query';

import { templateQueries } from '@/entities/template';
import { useHapticFeedback } from '@/shared/hooks/useHapticFeedback';
import { useToast } from '@/shared/ui/components/Toast';

import {
  updateTemplate,
  type UpdateTemplateParams,
} from '../api/update-template';

export const useUpdateTemplate = () => {
  const { mutate, isPending } = useMutation({ mutationFn: updateTemplate });
  const queryClient = useQueryClient();
  const toast = useToast();
  const haptic = useHapticFeedback();

  const handleUpdateTemplate = (
    params: UpdateTemplateParams,
    onSuccess?: VoidFunction,
  ) => {
    mutate(params, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [templateQueries.baseKey],
        });
        onSuccess?.();
      },
      onError: () => {
        haptic.notificationOccurred('error');
        toast.error('Произошла ошибка');
      },
    });
  };

  return { handleUpdateTemplate, isPending };
};
