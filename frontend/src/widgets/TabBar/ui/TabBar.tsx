import { Tabbar } from '@telegram-apps/telegram-ui';
import { mainButton, useSignal } from '@tma.js/sdk-react';
import { type FC, type RefObject, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useTabBarItems } from '../lib/useTabBarItems';
import styles from './TabBar.module.scss';

interface TabBarProps {
  ref: RefObject<HTMLDivElement | null>;
}

export const TabBar: FC<TabBarProps> = (props) => {
  const { ref } = props;
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(location.pathname);
  const items = useTabBarItems();
  const navigate = useNavigate();
  const isMainButtonVisible = useSignal(mainButton.isVisible);

  useEffect(() => {
    setSelectedTab(location.pathname);
  }, [location]);

  if (isMainButtonVisible) return null;

  const createClickHandler = (path: string) => () => {
    navigate(path);
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    <Tabbar ref={ref} className={styles.menu}>
      {items.map((item) => (
        <Tabbar.Item
          key={item.path}
          selected={selectedTab === item.path}
          text={item.text}
          onClick={createClickHandler(item.path)}
        >
          {item.icon}
        </Tabbar.Item>
      ))}
    </Tabbar>
  );
};
