import { NotificationContext, Notification } from '@asap-hub/react-context';
import { FC, useCallback, useState } from 'react';

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
        prev.filter((n) => n.message !== notification.message),
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
