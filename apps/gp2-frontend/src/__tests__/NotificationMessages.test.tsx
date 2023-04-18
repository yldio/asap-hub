import { PageNotifications } from '@asap-hub/gp2-components';
import { useNotificationContext } from '@asap-hub/react-context';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect, useState } from 'react';
import NotificationMessages from '../NotificationMessages';

const TestNotificationComponent: React.FC = ({ children }) => {
  const { addNotification } = useNotificationContext();

  const [showWelcomeBackBanner, setShowWelcomeBackBanner] = useState(true);

  const welcomeBackMessage = `Welcome back to the GP2 Hub!`;
  useEffect(() => {
    if (showWelcomeBackBanner) {
      addNotification({
        message: welcomeBackMessage,
        page: 'dashboard',
        type: 'info',
      });
      setShowWelcomeBackBanner(false);
    }
  }, [showWelcomeBackBanner, addNotification, welcomeBackMessage]);
  return <div>{children}</div>;
};

describe('NotificationMessages', () => {
  it('renders the children', () => {
    render(<NotificationMessages>text content</NotificationMessages>);
    expect(screen.getByText('text content')).toBeVisible();
  });
  it('provides a notification context', () => {
    render(
      <NotificationMessages>
        <TestNotificationComponent>
          <PageNotifications page="dashboard">
            {() => 'content'}
          </PageNotifications>
        </TestNotificationComponent>
      </NotificationMessages>,
    );
    expect(screen.getByText('Welcome back to the GP2 Hub!')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(
      screen.queryByText('Welcome back to the GP2 Hub!'),
    ).not.toBeInTheDocument();
  });
});
