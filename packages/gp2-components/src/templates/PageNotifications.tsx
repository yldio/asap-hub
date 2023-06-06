import { Toast } from '@asap-hub/react-components';
import {
  Page,
  useNotificationContext,
  Notification,
} from '@asap-hub/react-context';
import { css } from '@emotion/react';
import { ReactNode, useEffect } from 'react';

export type PageNotificationsProps = {
  page: Page;
  children: (notification?: Notification) => ReactNode;
};
const PageNotifications: React.FC<PageNotificationsProps> = ({
  page,
  children,
}) => {
  const { notifications, removeNotification } = useNotificationContext();
  const pageNotifications = notifications.filter(
    (notification) => notification.page === page,
  );
  const displayNotification = pageNotifications[0];
  useEffect(
    () => () => displayNotification && removeNotification(displayNotification),
    [displayNotification, removeNotification],
  );
  return (
    <>
      {displayNotification && (
        <div
          css={css({ width: '100vw', position: 'absolute', top: 0, left: 0 })}
        >
          <Toast
            accent={displayNotification.type}
            onClose={() => removeNotification(displayNotification)}
          >
            {displayNotification.message}
          </Toast>
        </div>
      )}
      {children(displayNotification)}
    </>
  );
};

export default PageNotifications;
