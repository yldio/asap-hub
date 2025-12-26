import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { NavigationBlockerProvider } from '../NavigationBlockerContext';
import { useNavigationWarning } from '../useNavigationWarning';

describe('useNavigationWarning', () => {
  let addEventListenerSpy: jest.SpyInstance;
  let removeEventListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window.history, 'pushState').mockImplementation(() => {});
    jest.spyOn(window.history, 'go').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location">{location.pathname}</div>;
  };

  const TestComponent = ({
    shouldBlock,
    message,
  }: {
    shouldBlock: boolean;
    message?: string;
  }) => {
    const { blockedNavigate } = useNavigationWarning({ shouldBlock, message });
    return (
      <div>
        <button onClick={() => blockedNavigate(-1)}>Go Back</button>
        <button onClick={() => blockedNavigate('/')}>Go Home</button>
        <LocationDisplay />
      </div>
    );
  };

  const renderWithProviders = (
    ui: React.ReactElement,
    initialEntries = ['/first', '/test'],
  ) =>
    render(
      <MemoryRouter initialEntries={initialEntries} initialIndex={1}>
        <NavigationBlockerProvider>{ui}</NavigationBlockerProvider>
      </MemoryRouter>,
    );

  describe('beforeunload handler', () => {
    it('adds beforeunload handler when shouldBlock is true', () => {
      renderWithProviders(<TestComponent shouldBlock={true} />);

      const beforeunloadCalls = addEventListenerSpy.mock.calls.filter(
        (call) => call[0] === 'beforeunload',
      );
      expect(beforeunloadCalls.length).toBeGreaterThan(0);
    });

    it('does not add beforeunload handler when shouldBlock is false', () => {
      renderWithProviders(<TestComponent shouldBlock={false} />);

      const beforeunloadCalls = addEventListenerSpy.mock.calls.filter(
        (call) => call[0] === 'beforeunload',
      );
      expect(beforeunloadCalls).toHaveLength(0);
    });

    it('removes beforeunload handler on unmount', () => {
      const { unmount } = renderWithProviders(
        <TestComponent shouldBlock={true} />,
      );

      const beforeunloadCallsBefore = addEventListenerSpy.mock.calls.filter(
        (call) => call[0] === 'beforeunload',
      );
      expect(beforeunloadCallsBefore.length).toBeGreaterThan(0);

      unmount();

      const removeBeforeunloadCalls = removeEventListenerSpy.mock.calls.filter(
        (call) => call[0] === 'beforeunload',
      );
      expect(removeBeforeunloadCalls.length).toBeGreaterThan(0);
    });

    it('removes beforeunload handler when shouldBlock changes to false', async () => {
      const ToggleComponent = () => {
        const [shouldBlock, setShouldBlock] = useState(true);
        useNavigationWarning({ shouldBlock });

        return <button onClick={() => setShouldBlock(false)}>Disable</button>;
      };

      renderWithProviders(<ToggleComponent />);

      // Initially should have added beforeunload
      const initialBeforeunloadCalls = addEventListenerSpy.mock.calls.filter(
        (call) => call[0] === 'beforeunload',
      );
      expect(initialBeforeunloadCalls.length).toBeGreaterThan(0);

      await userEvent.click(screen.getByText('Disable'));

      // Should have removed beforeunload
      await waitFor(() => {
        const removeBeforeunloadCalls =
          removeEventListenerSpy.mock.calls.filter(
            (call) => call[0] === 'beforeunload',
          );
        expect(removeBeforeunloadCalls.length).toBeGreaterThan(0);
      });
    });
  });

  describe('popstate handler', () => {
    it('adds popstate handler when shouldBlock is true', () => {
      renderWithProviders(<TestComponent shouldBlock={true} />);

      const popstateCalls = addEventListenerSpy.mock.calls.filter(
        (call) => call[0] === 'popstate',
      );
      expect(popstateCalls.length).toBeGreaterThan(0);
    });

    it('removes popstate handler on unmount', () => {
      const { unmount } = renderWithProviders(
        <TestComponent shouldBlock={true} />,
      );

      unmount();

      const removePopstateCalls = removeEventListenerSpy.mock.calls.filter(
        (call) => call[0] === 'popstate',
      );
      expect(removePopstateCalls.length).toBeGreaterThan(0);
    });
  });

  describe('blockedNavigate', () => {
    it('navigates directly when not blocked', async () => {
      renderWithProviders(<TestComponent shouldBlock={false} />);

      expect(screen.getByTestId('location')).toHaveTextContent('/test');

      await userEvent.click(screen.getByText('Go Back'));

      await waitFor(() => {
        expect(screen.getByTestId('location')).toHaveTextContent('/first');
      });
      expect(window.confirm).not.toHaveBeenCalled();
    });

    it('navigates to path when not blocked', async () => {
      renderWithProviders(<TestComponent shouldBlock={false} />);

      await userEvent.click(screen.getByText('Go Home'));

      await waitFor(() => {
        expect(screen.getByTestId('location')).toHaveTextContent('/');
      });
    });

    it('shows confirm when blocked', async () => {
      renderWithProviders(<TestComponent shouldBlock={true} />);

      await userEvent.click(screen.getByText('Go Back'));

      expect(window.confirm).toHaveBeenCalled();
    });

    it('navigates when blocked and user confirms', async () => {
      jest.spyOn(window, 'confirm').mockReturnValue(true);
      renderWithProviders(<TestComponent shouldBlock={true} />);

      await userEvent.click(screen.getByText('Go Back'));

      await waitFor(() => {
        expect(screen.getByTestId('location')).toHaveTextContent('/first');
      });
    });

    it('does not navigate when blocked and user cancels', async () => {
      jest.spyOn(window, 'confirm').mockReturnValue(false);
      renderWithProviders(<TestComponent shouldBlock={true} />);

      await userEvent.click(screen.getByText('Go Back'));

      // Should still be on /test
      expect(screen.getByTestId('location')).toHaveTextContent('/test');
    });

    it('uses custom message in confirm dialog', async () => {
      renderWithProviders(
        <TestComponent shouldBlock={true} message="Custom warning" />,
      );

      await userEvent.click(screen.getByText('Go Back'));

      expect(window.confirm).toHaveBeenCalledWith('Custom warning');
    });
  });

  describe('context registration', () => {
    it('registers with context when shouldBlock is true', async () => {
      renderWithProviders(<TestComponent shouldBlock={true} />);

      await userEvent.click(screen.getByText('Go Back'));
      expect(window.confirm).toHaveBeenCalled();
    });

    it('unregisters when shouldBlock becomes false', async () => {
      const ToggleComponent = () => {
        const [shouldBlock, setShouldBlock] = useState(true);
        const { blockedNavigate } = useNavigationWarning({ shouldBlock });

        return (
          <div>
            <button onClick={() => setShouldBlock(false)}>Disable</button>
            <button onClick={() => blockedNavigate(-1)}>Navigate</button>
            <LocationDisplay />
          </div>
        );
      };

      renderWithProviders(<ToggleComponent />);

      // Initially blocked
      await userEvent.click(screen.getByText('Navigate'));
      expect(window.confirm).toHaveBeenCalled();

      jest.clearAllMocks();

      // Disable blocking
      await userEvent.click(screen.getByText('Disable'));

      // Should navigate without confirm
      await userEvent.click(screen.getByText('Navigate'));
      expect(window.confirm).not.toHaveBeenCalled();
    });
  });
});
