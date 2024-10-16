import { NotificationContext } from '@asap-hub/react-context';
import { act, render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory, History } from 'history';
import { ComponentProps, ReactNode } from 'react';
import { ValidationErrorResponse } from '@asap-hub/model';
import { Link, MemoryRouter, Route, Router } from 'react-router-dom';
import { Button } from '@asap-hub/react-components';
import Form from '../Form';

const renderWithRouter = (children: ReactNode) =>
  render(<MemoryRouter>{children}</MemoryRouter>);

const props: ComponentProps<typeof Form> = {
  dirty: false,
  children: () => null,
};

const onDisplayModal = null;

let getUserConfirmation!: jest.MockedFunction<
  (message: string, callback: (confirmed: boolean) => void) => void
>;
let history!: History;
beforeEach(() => {
  getUserConfirmation = jest.fn((_message, cb) => cb(true));
  history = createMemoryHistory({ getUserConfirmation });
});

it('renders a form with given children', () => {
  const { getByText } = renderWithRouter(
    <Form {...props}>{() => 'Content'}</Form>,
  );
  expect(getByText('Content')).toBeVisible();
});

it('initially does not prompt when trying to leave', () => {
  const { getByText } = renderWithRouter(
    <Router history={history}>
      <Form {...props}>
        {() => <Link to={'/another-url'}>Navigate away</Link>}
      </Form>
    </Router>,
  );

  userEvent.click(getByText(/navigate/i));
  expect(getUserConfirmation).not.toHaveBeenCalled();
});
it('prompts when trying to leave after making edits', () => {
  const { getByText } = renderWithRouter(
    <Router history={history}>
      <Form {...props} dirty>
        {() => <Link to={'/another-url'}>Navigate away</Link>}
      </Form>
    </Router>,
  );

  userEvent.click(getByText(/navigate/i));
  expect(getUserConfirmation).toHaveBeenCalled();
});

describe('on cancel', () => {
  it('prompts after making edits', () => {
    const { getByText } = renderWithRouter(
      <Router history={history}>
        <Form {...props} dirty>
          {({ onCancel }) => (
            <>
              <input type="text" required />
              <Button primary onClick={onCancel}>
                cancel
              </Button>
            </>
          )}
        </Form>
      </Router>,
    );

    userEvent.click(getByText(/^cancel/i));
    expect(getUserConfirmation).toHaveBeenCalled();
  });
  it('goes to the root route if previous navigation is not available', () => {
    const { getByText } = renderWithRouter(
      <Router history={history}>
        <Form {...props} dirty>
          {({ onCancel }) => (
            <>
              <input type="text" required />
              <Button primary onClick={onCancel}>
                cancel
              </Button>
            </>
          )}
        </Form>
      </Router>,
    );

    userEvent.click(getByText(/^cancel/i));
    expect(history.location.pathname).toBe('/');
  });

  it('goes back in browser history if previous navigation is available', () => {
    const { getByText } = renderWithRouter(
      <Router history={history}>
        <Route path="/form">
          <Form {...props} dirty>
            {({ onCancel }) => (
              <>
                <input type="text" required />
                <Button primary onClick={onCancel}>
                  cancel
                </Button>
              </>
            )}
          </Form>
        </Route>
      </Router>,
    );

    history.push('/another-url');
    history.push('/form');

    userEvent.click(getByText(/^cancel/i));
    expect(history.location.pathname).toBe('/another-url');
  });
});

describe('when saving', () => {
  describe('and the form is invalid', () => {
    it('does not call onSave', () => {
      const handleSave = jest.fn();
      const addNotification = jest.fn();

      const { getByText } = renderWithRouter(
        <Form {...props} dirty>
          {({ getWrappedOnSave }) => (
            <>
              <input type="text" required />
              <Button
                primary
                onClick={getWrappedOnSave(
                  handleSave,
                  addNotification,
                  onDisplayModal,
                )}
              >
                save
              </Button>
            </>
          )}
        </Form>,
      );

      userEvent.click(getByText(/^save/i));
      expect(handleSave).not.toHaveBeenCalled();
    });

    it('does not call onSave when parent validation fails', () => {
      const handleSave = jest.fn(() => Promise.resolve());
      const addNotificationOnSave = jest.fn();
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
      const { getByText } = renderWithRouter(
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

      userEvent.click(getByText(/^save/i));

      expect(handleValidate).toHaveBeenCalled();
      expect(handleSave).not.toHaveBeenCalled();
    });
  });

  describe('and the form is valid', () => {
    let result!: RenderResult;

    let handleSave!: jest.MockedFunction<() => Promise<void>>;
    let resolveSave!: () => void;
    let rejectSave!: (error: Error) => void;
    const addNotificationOnSave = jest.fn();

    beforeEach(() => {
      handleSave = jest.fn().mockReturnValue(
        new Promise<void>((resolve, reject) => {
          resolveSave = resolve;
          rejectSave = reject;
        }),
      );
      history = createMemoryHistory({ getUserConfirmation });
      result = renderWithRouter(
        <NotificationContext.Provider
          value={{
            notifications: [],
            addNotification: jest.fn(),
            removeNotification: jest.fn(),
          }}
        >
          <Router history={history}>
            <Form {...props} dirty>
              {({ getWrappedOnSave, isSaving }) => (
                <>
                  <Link to={'/another-url'}>Navigate away</Link>
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
          </Router>{' '}
        </NotificationContext.Provider>,
      );
    });

    it('calls onSave', async () => {
      const { getByText } = result;

      userEvent.click(getByText(/^save/i));
      expect(handleSave).toHaveBeenCalled();

      act(resolveSave);

      await waitFor(() =>
        expect(getByText(/^save/i).closest('button')).toBeEnabled(),
      );
    });

    it('disables the save button while saving', async () => {
      const { getByText, unmount } = result;

      userEvent.click(getByText(/^save/i));
      expect(getByText(/^save/i).closest('button')).toBeDisabled();

      resolveSave();
      await waitFor(() =>
        expect(getByText(/^save/i).closest('button')).toBeEnabled(),
      );
      unmount();
    });

    it('prompts when trying to leave while saving', async () => {
      const { getByText, unmount } = result;
      userEvent.click(getByText(/^save/i));

      userEvent.click(getByText(/navigate/i));
      expect(getUserConfirmation).toHaveBeenCalled();

      resolveSave();
      await waitFor(() =>
        expect(getByText(/^save/i).closest('button')).toBeEnabled(),
      );
      unmount();
    });

    describe('and the save succeeds', () => {
      beforeEach(() => {
        act(resolveSave);
      });

      it('resets to initial state once a saved form matches the default state', async () => {
        const { getByText, rerender } = result;

        userEvent.click(getByText(/^save/i));
        await waitFor(() =>
          expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        );
        rerender(
          <NotificationContext.Provider
            value={{
              notifications: [],
              addNotification: jest.fn(),
              removeNotification: jest.fn(),
            }}
          >
            <Router history={history}>
              <Form {...props}>
                {({ getWrappedOnSave, isSaving }) => (
                  <>
                    <Link to={'/another-url'}>Navigate away</Link>
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
            </Router>
          </NotificationContext.Provider>,
        );
      });

      it('re-enables the save button', async () => {
        const { getByText } = result;

        userEvent.click(getByText(/^save/i));
        await waitFor(() =>
          expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        );
      });
    });
    describe('and the save fails', () => {
      beforeEach(() => {
        act(() => rejectSave(new Error('Error')));
      });

      it('shows an error message', async () => {
        const { getByText } = result;

        userEvent.click(getByText(/^save/i));
        await waitFor(() => expect(handleSave).toHaveBeenCalled());
        await waitFor(() =>
          expect(addNotificationOnSave).toHaveBeenCalledWith(
            'There was an error and we were unable to save your changes. Please try again.',
          ),
        );
      });

      it('re-enables the save button', async () => {
        const { getByText } = result;

        userEvent.click(getByText(/^save/i));

        await waitFor(() =>
          expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        );
      });

      it('prompts when trying to leave', async () => {
        const { getByText } = result;
        userEvent.click(getByText(/^save/i));

        userEvent.click(getByText(/navigate/i));
        expect(getUserConfirmation).toHaveBeenCalled();

        await waitFor(() =>
          expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        );
      });
    });
  });
  it('sets redirect path', async () => {
    const addNotificationOnSave = jest.fn();
    const handleSave = jest.fn().mockReturnValue({ field: 'value' });
    const result = renderWithRouter(
      <NotificationContext.Provider
        value={{
          notifications: [],
          addNotification: jest.fn(),
          removeNotification: jest.fn(),
        }}
      >
        <Router history={history}>
          <Form {...props}>
            {({ setRedirectOnSave, isSaving, getWrappedOnSave }) => (
              <>
                <Link to={'/another-url'}>Navigate away</Link>
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
        </Router>
      </NotificationContext.Provider>,
    );

    const { getByText } = result;

    userEvent.click(getByText(/^save/i));

    await waitFor(() => expect(history.location.pathname).toBe('/another-url'));
  });

  it('calls onDisplayModal when provided', async () => {
    const addNotificationOnSave = jest.fn();
    const handleSave = jest.fn().mockReturnValue({ field: 'value' });
    const onDisplayModalFn = jest.fn();
    const result = renderWithRouter(
      <NotificationContext.Provider
        value={{
          notifications: [],
          addNotification: jest.fn(),
          removeNotification: jest.fn(),
        }}
      >
        <Router history={history}>
          <Form {...props}>
            {({ setRedirectOnSave, isSaving, getWrappedOnSave }) => (
              <>
                <Link to={'/another-url'}>Navigate away</Link>
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
        </Router>
      </NotificationContext.Provider>,
    );

    const { getByText } = result;

    userEvent.click(getByText(/^save/i));
    await waitFor(() => {
      expect(onDisplayModalFn).toHaveBeenCalled();
    });
    expect(handleSave).not.toHaveBeenCalled();
  });
});
