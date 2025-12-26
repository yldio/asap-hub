import { NotificationContext } from '@asap-hub/react-context';
import {
  act,
  render,
  RenderResult,
  waitFor,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps, ReactNode } from 'react';
import { ValidationErrorResponse } from '@asap-hub/model';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import {
  Anchor,
  Button,
  NavigationBlockerProvider,
} from '@asap-hub/react-components';
import Form from '../Form';

const renderWithRouter = (children: ReactNode) =>
  render(<StaticRouter location="/">{children}</StaticRouter>);

const renderWithProviders = (
  children: ReactNode,
  { initialEntries = ['/'] } = {},
) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <NavigationBlockerProvider>{children}</NavigationBlockerProvider>
    </MemoryRouter>,
  );

const props: ComponentProps<typeof Form> = {
  dirty: false,
  children: () => null,
};

// Helper to display current location for navigation tests
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

describe('Form', () => {
  beforeEach(() => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders a form with given children', () => {
    const { getByText } = renderWithRouter(
      <Form {...props}>{() => 'Content'}</Form>,
    );
    expect(getByText('Content')).toBeVisible();
  });

  describe('navigation blocking', () => {
    it('does not prompt when trying to leave and form is not dirty', async () => {
      renderWithProviders(
        <Form {...props}>
          {() => <Anchor href="/another-url">Navigate away</Anchor>}
        </Form>,
      );

      await userEvent.click(screen.getByText(/navigate/i));
      expect(window.confirm).not.toHaveBeenCalled();
    });

    it('prompts when trying to leave after making edits', async () => {
      renderWithProviders(
        <Form {...props} dirty>
          {() => <Anchor href="/another-url">Navigate away</Anchor>}
        </Form>,
      );

      await userEvent.click(screen.getByText(/navigate/i));
      expect(window.confirm).toHaveBeenCalled();
    });
  });

  describe('on cancel', () => {
    it('prompts after making edits', async () => {
      renderWithProviders(
        <Form {...props} dirty>
          {({ onCancel }) => (
            <>
              <input type="text" />
              <Button primary onClick={onCancel}>
                cancel
              </Button>
            </>
          )}
        </Form>,
      );

      await userEvent.click(screen.getByText(/^cancel/i));
      expect(window.confirm).toHaveBeenCalled();
    });

    it('goes to the root route if previous navigation is not available', async () => {
      jest.spyOn(window, 'confirm').mockReturnValue(true);
      // Simulate only one entry in history
      const originalHistoryLength = window.history.length;
      Object.defineProperty(window.history, 'length', {
        value: 1,
        writable: true,
        configurable: true,
      });

      renderWithProviders(
        <>
          <Form {...props} dirty>
            {({ onCancel }) => (
              <Button primary onClick={onCancel}>
                cancel
              </Button>
            )}
          </Form>
          <LocationDisplay />
        </>,
        { initialEntries: ['/form'] },
      );

      await userEvent.click(screen.getByText(/^cancel/i));
      await waitFor(() => {
        expect(screen.getByTestId('location')).toHaveTextContent('/');
      });

      // Restore original history length
      Object.defineProperty(window.history, 'length', {
        value: originalHistoryLength,
        writable: true,
        configurable: true,
      });
    });

    it('goes back in browser history if previous navigation is available', async () => {
      jest.spyOn(window, 'confirm').mockReturnValue(true);

      renderWithProviders(
        <>
          <Form {...props} dirty>
            {({ onCancel }) => (
              <Button primary onClick={onCancel}>
                cancel
              </Button>
            )}
          </Form>
          <LocationDisplay />
        </>,
        { initialEntries: ['/another-url', '/form'] },
      );

      expect(screen.getByTestId('location')).toHaveTextContent('/form');

      await userEvent.click(screen.getByText(/^cancel/i));
      await waitFor(() => {
        expect(screen.getByTestId('location')).toHaveTextContent(
          '/another-url',
        );
      });
    });
  });

  describe('when saving', () => {
    const addNotificationOnSave = jest.fn();
    const onDisplayModal = null;

    describe('and the form is invalid', () => {
      it('does not call onSave', async () => {
        const handleSave = jest.fn();

        const { getByText } = renderWithProviders(
          <Form {...props} dirty>
            {({ getWrappedOnSave }) => (
              <>
                <input type="text" required />
                <Button
                  primary
                  onClick={getWrappedOnSave(
                    handleSave,
                    addNotificationOnSave,
                    onDisplayModal,
                  )}
                >
                  save
                </Button>
              </>
            )}
          </Form>,
        );

        await userEvent.click(getByText(/^save/i));
        expect(handleSave).not.toHaveBeenCalled();
      });

      it('does not call onSave when parent validation fails', async () => {
        const handleSave = jest.fn(() => Promise.resolve());
        const handleValidate = jest.fn(() => false);
        const serverErrors: ValidationErrorResponse['data'] = [
          {
            instancePath: '/link',
            keyword: 'unique',
            message: 'must be unique',
            params: { type: 'string' },
            schemaPath: '#/properties/link/unique',
          },
        ];
        const { getByText } = renderWithProviders(
          <NotificationContext.Provider
            value={{
              notifications: [],
              addNotification: jest.fn(),
              removeNotification: jest.fn(),
            }}
          >
            <Form
              {...props}
              validate={handleValidate}
              serverErrors={serverErrors}
              dirty
            >
              {({ getWrappedOnSave }) => (
                <>
                  <input type="text" />
                  <Button
                    primary
                    onClick={getWrappedOnSave(
                      handleSave,
                      addNotificationOnSave,
                      onDisplayModal,
                    )}
                  >
                    save
                  </Button>
                </>
              )}
            </Form>
          </NotificationContext.Provider>,
        );

        await userEvent.click(getByText(/^save/i));

        expect(handleValidate).toHaveBeenCalled();
        expect(handleSave).not.toHaveBeenCalled();
      });
    });

    describe('and the form is valid', () => {
      let result!: RenderResult;
      let handleSave!: jest.MockedFunction<() => Promise<void>>;
      let resolveSave!: () => void;
      let rejectSave!: (error: Error) => void;

      beforeEach(() => {
        handleSave = jest.fn().mockReturnValue(
          new Promise<void>((resolve, reject) => {
            resolveSave = resolve;
            rejectSave = reject;
          }),
        );
        result = renderWithProviders(
          <NotificationContext.Provider
            value={{
              notifications: [],
              addNotification: jest.fn(),
              removeNotification: jest.fn(),
            }}
          >
            <Form {...props} dirty>
              {({ getWrappedOnSave, isSaving }) => (
                <>
                  <Anchor href="/another-url">Navigate away</Anchor>
                  <Button
                    primary
                    enabled={!isSaving}
                    onClick={getWrappedOnSave(
                      handleSave,
                      addNotificationOnSave,
                      onDisplayModal,
                    )}
                  >
                    save
                  </Button>
                </>
              )}
            </Form>
          </NotificationContext.Provider>,
        );
      });

      it('calls onSave', async () => {
        const { getByText } = result;

        await userEvent.click(getByText(/^save/i));
        expect(handleSave).toHaveBeenCalled();

        await act(async () => {
          resolveSave();
        });

        await waitFor(() =>
          expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        );
      });

      it('disables the save button while saving', async () => {
        const { getByText, unmount } = result;

        await userEvent.click(getByText(/^save/i));
        expect(getByText(/^save/i).closest('button')).toBeDisabled();

        await act(async () => {
          resolveSave();
        });
        await waitFor(() =>
          expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        );
        unmount();
      });

      it('prompts when trying to leave while saving', async () => {
        const { getByText, unmount } = result;
        await userEvent.click(getByText(/^save/i));

        await userEvent.click(getByText(/navigate/i));
        expect(window.confirm).toHaveBeenCalled();

        await act(async () => {
          resolveSave();
        });
        await waitFor(() =>
          expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        );
        unmount();
      });

      describe('and the save succeeds', () => {
        it('re-enables the save button', async () => {
          const { getByText } = result;

          await userEvent.click(getByText(/^save/i));
          await act(async () => {
            resolveSave();
          });
          await waitFor(() =>
            expect(getByText(/^save/i).closest('button')).toBeEnabled(),
          );
        });
      });

      describe('and the save fails', () => {
        it('shows an error message', async () => {
          const { getByText } = result;

          await userEvent.click(getByText(/^save/i));
          await act(async () => {
            rejectSave(new Error('Error'));
          });
          await waitFor(() => expect(handleSave).toHaveBeenCalled());
          await waitFor(() =>
            expect(addNotificationOnSave).toHaveBeenCalledWith(
              'There was an error and we were unable to save your changes. Please try again.',
            ),
          );
        });

        it('re-enables the save button', async () => {
          const { getByText } = result;

          await userEvent.click(getByText(/^save/i));

          await act(async () => {
            rejectSave(new Error('Error'));
          });
          await waitFor(() =>
            expect(getByText(/^save/i).closest('button')).toBeEnabled(),
          );
        });

        it('prompts when trying to leave', async () => {
          const { getByText } = result;
          await userEvent.click(getByText(/^save/i));

          await act(async () => {
            rejectSave(new Error('Error'));
          });

          await userEvent.click(getByText(/navigate/i));
          expect(window.confirm).toHaveBeenCalled();

          await waitFor(() =>
            expect(getByText(/^save/i).closest('button')).toBeEnabled(),
          );
        });
      });
    });

    it('sets redirect path', async () => {
      const handleSave = jest.fn().mockReturnValue({ field: 'value' });
      const result = renderWithProviders(
        <>
          <NotificationContext.Provider
            value={{
              notifications: [],
              addNotification: jest.fn(),
              removeNotification: jest.fn(),
            }}
          >
            <Form {...props}>
              {({ setRedirectOnSave, isSaving, getWrappedOnSave }) => (
                <>
                  <Anchor href="/another-url">Navigate away</Anchor>
                  <Button
                    primary
                    enabled={!isSaving}
                    onClick={async () => {
                      await getWrappedOnSave(
                        handleSave,
                        addNotificationOnSave,
                        onDisplayModal,
                      )();
                      setRedirectOnSave('/another-url');
                    }}
                  >
                    save
                  </Button>
                </>
              )}
            </Form>
          </NotificationContext.Provider>
          <LocationDisplay />
        </>,
        { initialEntries: ['/form'] },
      );

      const { getByText } = result;

      await userEvent.click(getByText(/^save/i));

      await waitFor(() =>
        expect(screen.getByTestId('location')).toHaveTextContent(
          '/another-url',
        ),
      );
    });

    it('calls onDisplayModal when provided', async () => {
      const handleSave = jest.fn().mockReturnValue({ field: 'value' });
      const onDisplayModalFn = jest.fn();
      const result = renderWithProviders(
        <NotificationContext.Provider
          value={{
            notifications: [],
            addNotification: jest.fn(),
            removeNotification: jest.fn(),
          }}
        >
          <Form {...props}>
            {({ setRedirectOnSave, isSaving, getWrappedOnSave }) => (
              <>
                <Anchor href="/another-url">Navigate away</Anchor>
                <Button
                  primary
                  enabled={!isSaving}
                  onClick={async () => {
                    await getWrappedOnSave(
                      handleSave,
                      addNotificationOnSave,
                      onDisplayModalFn,
                    )();
                    setRedirectOnSave('/another-url');
                  }}
                >
                  save
                </Button>
              </>
            )}
          </Form>
        </NotificationContext.Provider>,
      );

      const { getByText } = result;

      await userEvent.click(getByText(/^save/i));
      await waitFor(() => {
        expect(onDisplayModalFn).toHaveBeenCalled();
      });
      expect(handleSave).not.toHaveBeenCalled();
    });
  });
});
