import { mainButton } from '@tma.js/sdk-react';
import { type FC, useEffect } from 'react';

interface MainButtonProps {
  text: string;
  onClick: VoidFunction;
  disabled?: boolean;
}

export const MainButton: FC<MainButtonProps> = (props) => {
  const { text, disabled, onClick } = props;

  useEffect(() => {
    mainButton.show();
    return () => {
      mainButton.hide();
    };
  }, []);

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
