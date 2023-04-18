import { NotificationContext, Notification } from '@asap-hub/react-context';
import { FC, useCallback, useState } from 'react';

const isSameNotification = (a: Notification, b: Notification) =>
  a.message === b.message && a.page === b.page && a.type === b.type;

const NotificationMessages: FC = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const addNotification = useCallback(
    (notification: Notification) => {
      setNotifications((prev) => [...prev, notification]);
    },
    [setNotifications],
  );
  const removeNotification = useCallback(
    (notification: Notification) => {
      setNotifications((prev) =>
        prev.filter((n) => !isSameNotification(n, notification)),
      );
    },
    [setNotifications],
  );
  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationMessages;
