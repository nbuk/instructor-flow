import type { InputProps } from '@telegram-apps/telegram-ui';
import { type FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Input } from '@/shared/ui/Input';

interface RHFInputProps extends InputProps {
  name: string;
}

export const RHFInput: FC<RHFInputProps> = (props) => {
  const { name, ...rest } = props;

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          {...rest}
          status={fieldState.error?.message ? 'error' : 'default'}
        />
      )}
    />
  );
};
