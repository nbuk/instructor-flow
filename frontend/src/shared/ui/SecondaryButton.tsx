import { secondaryButton } from '@tma.js/sdk-react';
import { type FC, useEffect } from 'react';

interface SecondaryButtonProps {
  text: string;
  onClick: VoidFunction;
  disabled?: boolean;
  isLoading?: boolean;
}

export const SecondaryButton: FC<SecondaryButtonProps> = (props) => {
  const { text, disabled, isLoading, onClick } = props;

  useEffect(() => {
    secondaryButton.mount();
    secondaryButton.show();
    return () => {
      secondaryButton.hide();
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      secondaryButton.showLoader();
    } else {
      secondaryButton.hideLoader();
    }
  }, [isLoading]);

  useEffect(() => {
    secondaryButton.setParams({ text, isEnabled: !disabled });
    secondaryButton.onClick(onClick);

    return () => {
      secondaryButton.offClick(onClick);
    };
  }, [text, disabled, onClick]);

  return null;
};
