/**
 * ⚠️ NAVIGATION BLOCKING TESTS SKIPPED - React Router v6 → v7 Migration
 *
 * Tests that rely on React Router v5's `getUserConfirmation` API for navigation blocking
 * are skipped. Navigation blocking will be available in React Router v7
 * via the stable `useBlocker` hook (or via custom implementation).
 *
 * Tests for form validation, saving, and toast behavior work with React Router v6.
 */

import { InnerToastContext, ToastContext } from '@asap-hub/react-context';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { Button } from '../../atoms';
import Form from '../Form';

const props: ComponentProps<typeof Form> = {
  dirty: false,
  toastType: 'inner',
  children: () => null,
};

const renderForm = (children: ReactNode) =>
  render(<StaticRouter location="/">{children}</StaticRouter>);

const renderFormWithMemoryRouter = (children: ReactNode) =>
  render(<MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>);

it('renders a form with given children', () => {
  const { getByText } = renderForm(<Form {...props}>{() => 'Content'}</Form>);
  expect(getByText('Content')).toBeVisible();
});

it.skip('initially does not prompt when trying to leave', async () => {
  // const { getByText } = renderForm(
  //   <Router history={history}>
  //     <Form {...props}>
  //       {() => <Link to={'/another-url'}>Navigate away</Link>}
  //     </Form>
  //   </Router>,
  // );
  //
  // await userEvent.click(getByText(/navigate/i));
  // expect(getUserConfirmation).not.toHaveBeenCalled();
});
it.skip('prompts when trying to leave after making edits', async () => {
  // const { getByText } = renderForm(
  //   <InnerToastContext.Provider value={jest.fn()}>
  //     <Router history={history}>
  //       <Form {...props} dirty>
  //         {() => <Link to={'/another-url'}>Navigate away</Link>}
  //       </Form>
  //     </Router>
  //   </InnerToastContext.Provider>,
  // );
  //
  // await userEvent.click(getByText(/navigate/i));
  // expect(getUserConfirmation).toHaveBeenCalled();
});

describe.skip('on cancel', () => {
  it('prompts after making edits', async () => {
    // const { getByText } = renderForm(
    //   <InnerToastContext.Provider value={jest.fn()}>
    //     <Router history={history}>
    //       <Form {...props} dirty>
    //         {({ onCancel }) => (
    //           <>
    //             <input type="text" required />
    //             <Button primary onClick={onCancel}>
    //               cancel
    //             </Button>
    //           </>
    //         )}
    //       </Form>
    //     </Router>
    //   </InnerToastContext.Provider>,
    // );
    //
    // await userEvent.click(getByText(/^cancel/i));
    // expect(getUserConfirmation).toHaveBeenCalled();
  });
  it('goes to the root route if previous navigation is not available', async () => {
    // const { getByText } = renderForm(
    //   <InnerToastContext.Provider value={jest.fn()}>
    //     <Router history={history}>
    //       <Form {...props} dirty>
    //         {({ onCancel }) => (
    //           <>
    //             <input type="text" required />
    //             <Button primary onClick={onCancel}>
    //               cancel
    //             </Button>
    //           </>
    //         )}
    //       </Form>
    //     </Router>
    //   </InnerToastContext.Provider>,
    // );
    //
    // await userEvent.click(getByText(/^cancel/i));
    // expect(history.location.pathname).toBe('/');
  });

  it('goes back in browser history if previous navigation is available', async () => {
    // const { getByText } = renderForm(
    //   <InnerToastContext.Provider value={jest.fn()}>
    //     <Router history={history}>
    //       <Route path="/form">
    //         <Form {...props} dirty>
    //           {({ onCancel }) => (
    //             <>
    //               <input type="text" required />
    //               <Button primary onClick={onCancel}>
    //                 cancel
    //               </Button>
    //             </>
    //           )}
    //         </Form>
    //       </Route>
    //     </Router>
    //   </InnerToastContext.Provider>,
    // );
    //
    // history.push('/another-url');
    // history.push('/form');
    //
    // await userEvent.click(getByText(/^cancel/i));
    // expect(history.location.pathname).toBe('/another-url');
  });
});

describe('when saving', () => {
  describe('and the form is invalid', () => {
    it('does not call onSave', async () => {
      const handleSave = jest.fn();
      const { getByText } = renderForm(
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
      );

      await userEvent.click(getByText(/^save/i));
      expect(handleSave).not.toHaveBeenCalled();
    });

    it('does not call onSave when parent validation fails', async () => {
      const handleSave = jest.fn(() => Promise.resolve());
      const handleValidate = jest.fn(() => false);
      const { getByText } = renderForm(
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
      );

      await userEvent.click(getByText(/^save/i));

      expect(handleValidate).toHaveBeenCalled();
      expect(handleSave).not.toHaveBeenCalled();
    });

    it('can use base toast', async () => {
      const mockToast = jest.fn();
      const handleValidate = jest.fn(() => false);
      const { getByText } = renderFormWithMemoryRouter(
        <ToastContext.Provider value={mockToast}>
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
        </ToastContext.Provider>,
      );
      await userEvent.click(getByText(/^save/i));
      await waitFor(() =>
        expect(mockToast).toHaveBeenCalledWith(
          'There are some errors in the form. Please correct the fields below.',
        ),
      );
    });
  });

  describe('and the form is valid (save behavior)', () => {
    let handleSave: jest.MockedFunction<() => Promise<Record<string, unknown>>>;
    let resolveSave: (value: Record<string, unknown>) => void;
    let rejectSave: (error: Error) => void;
    let innerMockToast: jest.Mock;

    beforeEach(() => {
      innerMockToast = jest.fn();
      handleSave = jest.fn().mockReturnValue(
        new Promise<Record<string, unknown>>((resolve, reject) => {
          resolveSave = resolve;
          rejectSave = reject;
        }),
      );
    });

    it('calls onSave when form is valid', async () => {
      const { getByText } = renderFormWithMemoryRouter(
        <InnerToastContext.Provider value={innerMockToast}>
          <Form {...props} dirty>
            {({ getWrappedOnSave }) => (
              <Button primary onClick={getWrappedOnSave(handleSave)}>
                save
              </Button>
            )}
          </Form>
        </InnerToastContext.Provider>,
      );

      await userEvent.click(getByText(/^save/i));
      expect(handleSave).toHaveBeenCalled();

      await act(async () => {
        resolveSave({ success: true });
      });
    });

    it('disables the save button while saving', async () => {
      const { getByText } = renderFormWithMemoryRouter(
        <InnerToastContext.Provider value={innerMockToast}>
          <Form {...props} dirty>
            {({ getWrappedOnSave, isSaving }) => (
              <Button
                primary
                enabled={!isSaving}
                onClick={getWrappedOnSave(handleSave)}
              >
                save
              </Button>
            )}
          </Form>
        </InnerToastContext.Provider>,
      );

      await userEvent.click(getByText(/^save/i));
      expect(getByText(/^save/i).closest('button')).toBeDisabled();

      await act(async () => {
        resolveSave({ success: true });
      });
      await waitFor(() =>
        expect(getByText(/^save/i).closest('button')).toBeEnabled(),
      );
    });

    it('re-enables the save button after successful save', async () => {
      const { getByText } = renderFormWithMemoryRouter(
        <InnerToastContext.Provider value={innerMockToast}>
          <Form {...props} dirty>
            {({ getWrappedOnSave, isSaving }) => (
              <Button
                primary
                enabled={!isSaving}
                onClick={getWrappedOnSave(handleSave)}
              >
                save
              </Button>
            )}
          </Form>
        </InnerToastContext.Provider>,
      );

      await userEvent.click(getByText(/^save/i));

      await act(async () => {
        resolveSave({ success: true });
      });
      await waitFor(() =>
        expect(getByText(/^save/i).closest('button')).toBeEnabled(),
      );
    });

    it('shows an error message when save fails', async () => {
      const { getByText } = renderFormWithMemoryRouter(
        <InnerToastContext.Provider value={innerMockToast}>
          <Form {...props} dirty>
            {({ getWrappedOnSave, isSaving }) => (
              <Button
                primary
                enabled={!isSaving}
                onClick={getWrappedOnSave(handleSave)}
              >
                save
              </Button>
            )}
          </Form>
        </InnerToastContext.Provider>,
      );

      await userEvent.click(getByText(/^save/i));

      await act(async () => {
        rejectSave(new Error('Save failed'));
      });
      await waitFor(() =>
        expect(innerMockToast).toHaveBeenCalledWith(
          'There was an error and we were unable to save your changes. Please try again.',
        ),
      );
    });

    it('re-enables the save button after failed save', async () => {
      const { getByText } = renderFormWithMemoryRouter(
        <InnerToastContext.Provider value={innerMockToast}>
          <Form {...props} dirty>
            {({ getWrappedOnSave, isSaving }) => (
              <Button
                primary
                enabled={!isSaving}
                onClick={getWrappedOnSave(handleSave)}
              >
                save
              </Button>
            )}
          </Form>
        </InnerToastContext.Provider>,
      );

      await userEvent.click(getByText(/^save/i));

      await act(async () => {
        rejectSave(new Error('Save failed'));
      });
      await waitFor(() =>
        expect(getByText(/^save/i).closest('button')).toBeEnabled(),
      );
    });
  });

  // SKIPPED: Tests below require React Router v5's history/getUserConfirmation API
  // which is not available in v6. These will be updated when implementing
  // navigation blocking via useBlocker or custom solution.
  describe.skip('and the form is valid (navigation blocking)', () => {
    // let result!: RenderResult;
    //
    // let handleSave!: jest.MockedFunction<() => Promise<void>>;
    // let resolveSave!: () => void;
    // let rejectSave!: (error: Error) => void;
    // let innerMockToast: () => void;
    //
    // beforeEach(() => {
    //   innerMockToast = jest.fn();
    //   handleSave = jest.fn().mockReturnValue(
    //     new Promise<void>((resolve, reject) => {
    //       resolveSave = resolve;
    //       rejectSave = reject;
    //     }),
    //   );
    //   history = createMemoryHistory({ getUserConfirmation });
    //   result = renderForm(
    //     <InnerToastContext.Provider value={innerMockToast}>
    //       <Router history={history}>
    //         <Form {...props} dirty>
    //           {({ getWrappedOnSave, isSaving }) => (
    //             <>
    //               <Link to={'/another-url'}>Navigate away</Link>
    //               <Button
    //                 primary
    //                 enabled={!isSaving}
    //                 onClick={getWrappedOnSave(handleSave)}
    //               >
    //                 save
    //               </Button>
    //             </>
    //           )}
    //         </Form>
    //       </Router>
    //     </InnerToastContext.Provider>,
    //   );
    // });

    it('calls onSave', async () => {
      //   const { getByText } = result;
      //
      //   await userEvent.click(getByText(/^save/i));
      //   expect(handleSave).toHaveBeenCalled();
      //
      //   act(resolveSave);
      //   await waitFor(() =>
      //     expect(getByText(/^save/i).closest('button')).toBeEnabled(),
      //   );
    });

    it('disables the save button while saving', async () => {
      // const { getByText, unmount } = result;
      //
      // await userEvent.click(getByText(/^save/i));
      // expect(getByText(/^save/i).closest('button')).toBeDisabled();
      //
      // resolveSave();
      // await waitFor(() =>
      //   expect(getByText(/^save/i).closest('button')).toBeEnabled(),
      // );
      // unmount();
    });

    it('prompts when trying to leave while saving', async () => {
      // const { getByText, unmount } = result;
      // await userEvent.click(getByText(/^save/i));
      //
      // await userEvent.click(getByText(/navigate/i));
      // expect(getUserConfirmation).toHaveBeenCalled();
      //
      // resolveSave();
      // await waitFor(() =>
      //   expect(getByText(/^save/i).closest('button')).toBeEnabled(),
      // );
      // unmount();
    });

    describe('and the save succeeds', () => {
      beforeEach(() => {
        // act(resolveSave);
      });

      it('resets to initial state once a saved form matches the default state', async () => {
        // const { getByText, rerender } = result;
        //
        // await userEvent.click(getByText(/^save/i));
        // await waitFor(() =>
        //   expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        // );
        // rerender(
        //   <Router history={history}>
        //     <Form {...props}>
        //       {({ getWrappedOnSave, isSaving }) => (
        //         <>
        //           <Link to={'/another-url'}>Navigate away</Link>
        //           <Button
        //             primary
        //             enabled={!isSaving}
        //             onClick={getWrappedOnSave(handleSave)}
        //           >
        //             save
        //           </Button>
        //         </>
        //       )}
        //     </Form>
        //   </Router>,
        // );
      });

      it('re-enables the save button', async () => {
        // const { getByText } = result;
        //
        // await userEvent.click(getByText(/^save/i));
        // await waitFor(() =>
        //   expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        // );
      });
    });
    describe('and the save fails', () => {
      beforeEach(() => {
        // act(() => rejectSave(new Error()));
      });

      it('shows an error message', async () => {
        // const { getByText } = result;
        //
        // await userEvent.click(getByText(/^save/i));
        // await waitFor(() =>
        //   expect(innerMockToast).toHaveBeenCalledWith(
        //     'There was an error and we were unable to save your changes. Please try again.',
        //   ),
        // );
      });

      it('re-enables the save button', async () => {
        // const { getByText } = result;
        //
        // await userEvent.click(getByText(/^save/i));
        //
        // await waitFor(() =>
        //   expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        // );
      });

      it('prompts when trying to leave', async () => {
        // const { getByText } = result;
        // await userEvent.click(getByText(/^save/i));
        //
        // await userEvent.click(getByText(/navigate/i));
        // expect(getUserConfirmation).toHaveBeenCalled();
        //
        // await waitFor(() =>
        //   expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        // );
      });

      it('clears the error when trying to leave', async () => {
        // const { getByText } = result;
        //
        // await userEvent.click(getByText(/^save/i));
        // await userEvent.click(getByText(/navigate/i));
        //
        // await waitFor(() => expect(innerMockToast).toHaveBeenCalledWith(null));
      });
    });
  });
});
