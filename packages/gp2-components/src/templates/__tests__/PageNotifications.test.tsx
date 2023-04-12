import { NotificationContext } from '@asap-hub/react-context';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PageNotifications from '../PageNotifications';

describe('PageNotifications', () => {
  const renderPageNotifications = (
    props = { page: 'dashboard' as const },
    contextProps = {},
  ) => {
    const defaultProps = {
      notifications: [],
      addNotification: jest.fn(),
      removeNotification: jest.fn(),
    };
    render(
      <NotificationContext.Provider
        value={{ ...defaultProps, ...contextProps }}
      >
        <PageNotifications {...props}>
          {(notification) =>
            notification?.message
              ? 'Notification visible'
              : 'Notification not visible'
          }
        </PageNotifications>
      </NotificationContext.Provider>,
    );
  };
  it("renders the notification's message", () => {
    renderPageNotifications(
      { page: 'dashboard' },
      { notifications: [{ message: 'test', page: 'dashboard', type: 'info' }] },
    );
    expect(screen.getByText('test')).toBeVisible();
  });
  it('passes the notification to the children', () => {
    renderPageNotifications(
      { page: 'dashboard' },
      { notifications: [{ message: 'test', page: 'dashboard', type: 'info' }] },
    );
    expect(screen.getByText('Notification visible')).toBeVisible();
  });
  it("doesn't pass the notification to the children if doesn't exist", () => {
    renderPageNotifications({ page: 'dashboard' }, { notifications: [] });
    expect(screen.getByText('Notification not visible')).toBeVisible();
  });
  it('calls the remove notification', () => {
    const removeNotification = jest.fn();
    renderPageNotifications(
      { page: 'dashboard' },
      {
        notifications: [{ message: 'test', page: 'dashboard', type: 'info' }],
        removeNotification,
      },
    );
    expect(screen.getByText('Notification visible')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(removeNotification).toHaveBeenCalled();
  });
});
