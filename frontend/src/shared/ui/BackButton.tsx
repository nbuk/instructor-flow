import { backButton } from '@tma.js/sdk-react';
import { type FC, useEffect } from 'react';
import { useNavigate } from 'react-router';

interface BackButtonProps {
  onClick?: VoidFunction;
}

export const BackButton: FC<BackButtonProps> = (props) => {
  const { onClick } = props;

  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = () => {
      navigate(-1);
    };

    backButton.show();
    backButton.onClick(onClick ?? handleClick);

    return () => {
      backButton.hide();
      backButton.offClick(onClick ?? handleClick);
    };
  }, [onClick, navigate]);

  return null;
};
