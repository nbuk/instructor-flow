import {
  hapticFeedback,
  type ImpactHapticFeedbackStyle,
  type NotificationHapticFeedbackType,
} from '@tma.js/sdk-react';

export const useHapticFeedback = () => {
  const isSupported = hapticFeedback.isSupported();

  const impactOccurred = (style: ImpactHapticFeedbackStyle) => {
    if (!isSupported) return;
    hapticFeedback.impactOccurred(style);
  };

  const notificationOccurred = (type: NotificationHapticFeedbackType) => {
    if (!isSupported) return;
    hapticFeedback.notificationOccurred(type);
  };

  const selectionChanged = () => {
    if (!isSupported) return;
    hapticFeedback.selectionChanged();
  };

  return { impactOccurred, notificationOccurred, selectionChanged };
};
