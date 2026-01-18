import type { ReactNode } from 'react';

import { useAccount, UserRole } from '@/entities/account';
import { appRoutes } from '@/shared/configs/router';
import { ActionsIcon } from '@/shared/ui/icons/ActionsIcon';
import { AppIcon } from '@/shared/ui/icons/AppIcon';
import { BotMenuIcon } from '@/shared/ui/icons/BotMenuIcon';
import { PersonIcon } from '@/shared/ui/icons/PrersonIcon';
import { SettingsIcon } from '@/shared/ui/icons/SettingsIcon';

export interface TabBarItem {
  text: string;
  path: string;
  icon: ReactNode;
}

export const useTabBarItems = (): TabBarItem[] => {
  const { data, isLoading } = useAccount();
  if (isLoading) return [];

  if (data?.role === UserRole.INSTRUCTOR) {
    return [
      {
        text: 'Расписание',
        path: appRoutes.instructor.schedule.main,
        icon: <BotMenuIcon />,
      },
      {
        text: 'Запросы',
        path: appRoutes.instructor.requests,
        icon: <AppIcon />,
      },
      {
        text: 'Настройки',
        path: appRoutes.instructor.settings.main,
        icon: <SettingsIcon />,
      },
    ];
  }

  if (data?.role === UserRole.STUDENT) {
    return [
      {
        text: 'Расписание',
        path: appRoutes.student.schedule,
        icon: <ActionsIcon />,
      },
      {
        text: 'Занятия',
        path: appRoutes.student.lessons,
        icon: <BotMenuIcon />,
      },
      {
        text: 'Настройки',
        path: appRoutes.student.settings.main,
        icon: <PersonIcon />,
      },
    ];
  }

  return [];
};
