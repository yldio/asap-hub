import { InnerToastContext, ToastContext } from '@asap-hub/react-context';
import { act, render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory, History } from 'history';
import { ComponentProps } from 'react';
import {
  Link,
  MemoryRouter,
  Route,
  Router,
  StaticRouter,
} from 'react-router-dom';
import { Button } from '../../atoms';
import Form from '../Form';

const props: ComponentProps<typeof Form> = {
  dirty: false,
  toastType: 'inner',
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
    <InnerToastContext.Provider value={jest.fn()}>
      <Router history={history}>
        <Form {...props} dirty>
          {() => <Link to={'/another-url'}>Navigate away</Link>}
        </Form>
      </Router>
    </InnerToastContext.Provider>,
  );

  userEvent.click(getByText(/navigate/i));
  expect(getUserConfirmation).toHaveBeenCalled();
});

describe('on cancel', () => {
  it('prompts after making edits', () => {
    const { getByText } = render(
      <InnerToastContext.Provider value={jest.fn()}>
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
      </InnerToastContext.Provider>,
      { wrapper: MemoryRouter },
    );

    userEvent.click(getByText(/^cancel/i));
    expect(getUserConfirmation).toHaveBeenCalled();
  });
  it('goes to the root route if previous navigation is not available', () => {
    const { getByText } = render(
      <InnerToastContext.Provider value={jest.fn()}>
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
      </InnerToastContext.Provider>,
      { wrapper: MemoryRouter },
    );

    userEvent.click(getByText(/^cancel/i));
    expect(history.location.pathname).toBe('/');
  });

  it('goes back in browser history if previous navigation is available', () => {
    const { getByText } = render(
      <InnerToastContext.Provider value={jest.fn()}>
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
      </InnerToastContext.Provider>,
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
        <InnerToastContext.Provider value={jest.fn()}>
          <Form {...props} dirty>
            {({ getWrappedOnSave }) => (
              <>
                <input type="text" required />
                <Button primary onClick={getWrappedOnSave(handleSave)}>
                  save
                </Button>
              </>
            )}
          </Form>
        </InnerToastContext.Provider>,
        { wrapper: MemoryRouter },
      );

      userEvent.click(getByText(/^save/i));
      expect(handleSave).not.toHaveBeenCalled();
    });

    it('does not call onSave when parent validation fails', () => {
      const handleSave = jest.fn(() => Promise.resolve());
      const handleValidate = jest.fn(() => false);
      const { getByText } = render(
        <InnerToastContext.Provider value={jest.fn()}>
          <Form {...props} validate={handleValidate} dirty>
            {({ getWrappedOnSave }) => (
              <>
                <input type="text" />
                <Button primary onClick={getWrappedOnSave(handleSave)}>
                  save
                </Button>
              </>
            )}
          </Form>
        </InnerToastContext.Provider>,
        { wrapper: StaticRouter },
      );

      userEvent.click(getByText(/^save/i));

      expect(handleValidate).toHaveBeenCalled();
      expect(handleSave).not.toHaveBeenCalled();
    });

    it('can use base toast', async () => {
      const mockToast = jest.fn();
      const handleValidate = jest.fn(() => false);
      const { getByText } = render(
        <ToastContext.Provider value={mockToast}>
          <Router history={history}>
            <Form
              {...props}
              validate={handleValidate}
              toastType={undefined}
              dirty
            >
              {({ getWrappedOnSave }) => (
                <>
                  <input type="text" />
                  <Button primary onClick={getWrappedOnSave(jest.fn())}>
                    save
                  </Button>
                </>
              )}
            </Form>
          </Router>
        </ToastContext.Provider>,
      );
      userEvent.click(getByText(/^save/i));
      await waitFor(() =>
        expect(mockToast).toHaveBeenCalledWith(
          'There are some errors in the form. Please correct the fields below.',
        ),
      );
    });
  });

  describe('and the form is valid', () => {
    let result!: RenderResult;

    let handleSave!: jest.MockedFunction<() => Promise<void>>;
    let resolveSave!: () => void;
    let rejectSave!: (error: Error) => void;
    let innerMockToast: () => void;

    beforeEach(() => {
      innerMockToast = jest.fn();
      handleSave = jest.fn().mockReturnValue(
        new Promise<void>((resolve, reject) => {
          resolveSave = resolve;
          rejectSave = reject;
        }),
      );
      history = createMemoryHistory({ getUserConfirmation });
      result = render(
        <InnerToastContext.Provider value={innerMockToast}>
          <Router history={history}>
            <Form {...props} dirty>
              {({ getWrappedOnSave, isSaving }) => (
                <>
                  <Link to={'/another-url'}>Navigate away</Link>
                  <Button
                    primary
                    enabled={!isSaving}
                    onClick={getWrappedOnSave(handleSave)}
                  >
                    save
                  </Button>
                </>
              )}
            </Form>
          </Router>
        </InnerToastContext.Provider>,
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
          <Router history={history}>
            <Form {...props}>
              {({ getWrappedOnSave, isSaving }) => (
                <>
                  <Link to={'/another-url'}>Navigate away</Link>
                  <Button
                    primary
                    enabled={!isSaving}
                    onClick={getWrappedOnSave(handleSave)}
                  >
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

    it('shows an error message when fails with WritingDisabled', async () => {
      act(() => rejectSave(new Error('WritingDisabled')));
      const { getByText } = result;

      userEvent.click(getByText(/^save/i));
      await waitFor(() =>
        expect(innerMockToast).toHaveBeenCalledWith(
          'The hub is undergoing maintenance between from 4th to 8th September. During this period you will not be able to create or update research outputs on the hub. Normal service will resume on 11th September.',
          'warning',
        ),
      );
    });

    describe('and the save fails', () => {
      beforeEach(() => {
        act(() => rejectSave(new Error()));
      });

      it('shows an error message', async () => {
        const { getByText } = result;

        userEvent.click(getByText(/^save/i));
        await waitFor(() =>
          expect(innerMockToast).toHaveBeenCalledWith(
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

        await waitFor(() => expect(innerMockToast).toHaveBeenCalledWith(null));
      });
    });
  });
});
