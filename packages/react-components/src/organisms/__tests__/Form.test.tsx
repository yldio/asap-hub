import { ComponentProps } from 'react';
import {
  Router,
  MemoryRouter,
  StaticRouter,
  Link,
  Route,
} from 'react-router-dom';
import { History, createMemoryHistory } from 'history';
import { render, act, waitFor, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastContext } from '@asap-hub/react-context';

import Form from '../Form';
import { Button } from '../../atoms';

const props: ComponentProps<typeof Form> = {
  dirty: false,
  children: () => null,
};

let getUserConfirmation!: jest.MockedFunction<
  (message: string, callback: (confirmed: boolean) => void) => void
>;
let history!: History;
beforeEach(() => {
  getUserConfirmation = jest.fn((_message, cb) => cb(true));
  history = createMemoryHistory({ getUserConfirmation });
});

it('renders a form with given children', () => {
  const { getByText } = render(<Form {...props}>{() => 'Content'}</Form>, {
    wrapper: MemoryRouter,
  });
  expect(getByText('Content')).toBeVisible();
});

it('initially does not prompt when trying to leave', () => {
  const { getByText } = render(
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
  const { getByText } = render(
    <ToastContext.Provider value={jest.fn()}>
      <Router history={history}>
        <Form {...props} dirty>
          {() => <Link to={'/another-url'}>Navigate away</Link>}
        </Form>
      </Router>
    </ToastContext.Provider>,
  );

  userEvent.click(getByText(/navigate/i));
  expect(getUserConfirmation).toHaveBeenCalled();
});

describe('on cancel', () => {
  it('prompts after making edits', () => {
    const { getByText } = render(
      <ToastContext.Provider value={jest.fn()}>
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
        </Router>
      </ToastContext.Provider>,
      { wrapper: MemoryRouter },
    );

    userEvent.click(getByText(/^cancel/i));
    expect(getUserConfirmation).toHaveBeenCalled();
  });
  it('goes back in browser history if previous route is available', () => {
    const { getByText } = render(
      <ToastContext.Provider value={jest.fn()}>
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
        </Router>
      </ToastContext.Provider>,
      { wrapper: MemoryRouter },
    );

    userEvent.click(getByText(/^cancel/i));
    expect(history.location.pathname).toBe('/');
  });

  it('goes back in root page when previous route is not available', () => {
    const { getByText } = render(
      <ToastContext.Provider value={jest.fn()}>
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
        </Router>
      </ToastContext.Provider>,
      { wrapper: MemoryRouter },
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
      const { getByText } = render(
        <Form {...props} onSave={handleSave} dirty>
          {({ onSave: onSubmit }) => (
            <>
              <input type="text" required />
              <Button primary onClick={onSubmit}>
                save
              </Button>
            </>
          )}
        </Form>,
        { wrapper: MemoryRouter },
      );

      userEvent.click(getByText(/^save/i));
      expect(handleSave).not.toHaveBeenCalled();
    });

    it('does not call onSave when parent validation fails', () => {
      const handleSave = jest.fn(() => Promise.resolve());
      const handleValidate = jest.fn(() => false);
      const { getByText } = render(
        <Form {...props} validate={handleValidate} onSave={handleSave} dirty>
          {({ onSave: onSubmit }) => (
            <>
              <input type="text" />
              <Button primary onClick={onSubmit}>
                save
              </Button>
            </>
          )}
        </Form>,
        { wrapper: StaticRouter },
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
    let mockToast: () => void;

    beforeEach(() => {
      mockToast = jest.fn();
      handleSave = jest.fn().mockReturnValue(
        new Promise<void>((resolve, reject) => {
          resolveSave = resolve;
          rejectSave = reject;
        }),
      );
      history = createMemoryHistory({ getUserConfirmation });
      result = render(
        <ToastContext.Provider value={mockToast}>
          <Router history={history}>
            <Form {...props} onSave={handleSave} dirty>
              {({ onSave: onSubmit, isSaving }) => (
                <>
                  <Link to={'/another-url'}>Navigate away</Link>
                  <Button primary enabled={!isSaving} onClick={onSubmit}>
                    save
                  </Button>
                </>
              )}
            </Form>
          </Router>
        </ToastContext.Provider>,
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

      unmount();
      resolveSave();
    });

    it('prompts when trying to leave while saving', async () => {
      const { getByText, unmount } = result;
      userEvent.click(getByText(/^save/i));

      userEvent.click(getByText(/navigate/i));
      expect(getUserConfirmation).toHaveBeenCalled();

      unmount();
      resolveSave();
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
          <Router history={history}>
            <Form {...props} onSave={handleSave}>
              {({ onSave: onSubmit, isSaving }) => (
                <>
                  <Link to={'/another-url'}>Navigate away</Link>
                  <Button primary enabled={!isSaving} onClick={onSubmit}>
                    save
                  </Button>
                </>
              )}
            </Form>
          </Router>,
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
        act(() => rejectSave(new Error()));
      });

      it('shows an error message', async () => {
        const { getByText } = result;

        userEvent.click(getByText(/^save/i));
        await waitFor(() =>
          expect(mockToast).toHaveBeenCalledWith(
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

      it('clears the error when trying to leave', async () => {
        const { getByText } = result;

        userEvent.click(getByText(/^save/i));
        userEvent.click(getByText(/navigate/i));

        await waitFor(() => expect(mockToast).toHaveBeenCalledWith(null));
      });
    });
  });
});
