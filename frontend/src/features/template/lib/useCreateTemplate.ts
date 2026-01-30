import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useAccount, UserRole } from '@/entities/account';
import { useHapticFeedback } from '@/shared/hooks/useHapticFeedback';
import { useToast } from '@/shared/ui/components/Toast';

import { createTemplate } from '../api/create-template';
import type { TemplateFormSchema } from '../model/template-form.schema';

export const useCreateTemplate = () => {
  const { data: accountData } = useAccount<UserRole.INSTRUCTOR>();
  const { mutate, isPending } = useMutation({ mutationFn: createTemplate });
  const toast = useToast();
  const haptic = useHapticFeedback();

  const handleCreateTemplate = (
    data: TemplateFormSchema,
    onSuccess?: VoidFunction,
  ) => {
    mutate(
      { ...data, instructorId: accountData?.profile.instructorId ?? '' },
      {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: (e) => {
          haptic.notificationOccurred('error');
          if (e instanceof AxiosError) {
            if (e.status === 401) {
              toast.error('Неправильно заполнена форма');
              return;
            }
          }

          toast.error('Произошла ошибка');
        },
      },
    );
  };

  return { handleCreateTemplate, isPending };
};
