import { mainButton } from '@tma.js/sdk-react';
import { type FC, useEffect } from 'react';

interface MainButtonProps {
  text: string;
  onClick: VoidFunction;
  disabled?: boolean;
  isLoading?: boolean;
}

export const MainButton: FC<MainButtonProps> = (props) => {
  const { text, disabled, isLoading, onClick } = props;

  useEffect(() => {
    mainButton.show();
    return () => {
      mainButton.hide();
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      mainButton.showLoader();
    } else {
      mainButton.hideLoader();
    }
  }, [isLoading]);

  useEffect(() => {
    mainButton.setParams({ text, isEnabled: !disabled });
    mainButton.onClick(onClick);

    // if (disabled) {
    //   mainButton.disable();
    // } else {
    //   mainButton.enable();
    // }

    return () => {
      mainButton.offClick(onClick);
    };
  }, [text, disabled, onClick]);

  return null;
};
