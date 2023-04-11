import React from 'react';

export type Page = 'dashboard' | 'outputs';

export type Notification = {
  message: string;
  type: 'success' | 'error' | 'info';
  page: Page;
};

const notificationDefaultFunction = (): never => {
  throw new Error('Notification functions not provided');
};

export const NotificationContext = React.createContext<{
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (notification: Notification) => void;
}>({
  notifications: [],
  addNotification: notificationDefaultFunction,
  removeNotification: notificationDefaultFunction,
});

export const useNotificationContext = () =>
  React.useContext(NotificationContext);
