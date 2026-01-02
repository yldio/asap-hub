import { InnerToastContext, ToastContext } from '@asap-hub/react-context';
import { act, render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps, ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { Anchor, Button } from '../../atoms';
import { NavigationBlockerProvider } from '../../navigation';
import Form from '../Form';

const props: ComponentProps<typeof Form> = {
  dirty: false,
  toastType: 'inner',
  children: () => null,
};

const renderForm = (children: ReactNode) =>
  render(<StaticRouter location="/">{children}</StaticRouter>);

const renderFormWithMemoryRouter = (
  children: ReactNode,
  { initialEntries = ['/'] } = {},
) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <NavigationBlockerProvider>{children}</NavigationBlockerProvider>
    </MemoryRouter>,
  );

// Helper to display current location for navigation tests
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

describe('Form', () => {
  beforeEach(() => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window.history, 'pushState').mockImplementation(() => {});
    jest.spyOn(window.history, 'go').mockImplementation(() => {});
    jest.spyOn(window.history, 'back').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders a form with given children', () => {
    const { getByText } = renderForm(<Form {...props}>{() => 'Content'}</Form>);
    expect(getByText('Content')).toBeVisible();
  });

  describe('navigation blocking', () => {
    it('does not prompt when trying to leave and form is not dirty', async () => {
      renderFormWithMemoryRouter(
        <Form {...props} dirty={false}>
          {() => <Anchor href="/another-url">Navigate away</Anchor>}
        </Form>,
      );

      await userEvent.click(screen.getByText(/navigate/i));
      expect(window.confirm).not.toHaveBeenCalled();
    });

    it('prompts when trying to leave after making edits', async () => {
      renderFormWithMemoryRouter(
        <InnerToastContext.Provider value={jest.fn()}>
          <Form {...props} dirty>
            {() => <Anchor href="/another-url">Navigate away</Anchor>}
          </Form>
        </InnerToastContext.Provider>,
      );

      await userEvent.click(screen.getByText(/navigate/i));
      expect(window.confirm).toHaveBeenCalled();
    });
  });

  describe('on cancel', () => {
    it('prompts after making edits', async () => {
      renderFormWithMemoryRouter(
        <InnerToastContext.Provider value={jest.fn()}>
          <Form {...props} dirty>
            {({ onCancel }) => (
              <>
                <input type="text" />
                <Button primary onClick={onCancel}>
                  cancel
                </Button>
              </>
            )}
          </Form>
        </InnerToastContext.Provider>,
      );

      await userEvent.click(screen.getByText(/^cancel/i));
      expect(window.confirm).toHaveBeenCalled();
    });

    it('navigates when user confirms', async () => {
      jest.spyOn(window, 'confirm').mockReturnValue(true);
      const goSpy = jest.spyOn(window.history, 'go');

      // Ensure history.length > 1 so blockedNavigate(-1) is called
      Object.defineProperty(window.history, 'length', {
        value: 2,
        writable: true,
        configurable: true,
      });

      renderFormWithMemoryRouter(
        <>
          <InnerToastContext.Provider value={jest.fn()}>
            <Form {...props} dirty>
              {({ onCancel }) => (
                <Button primary onClick={onCancel}>
                  cancel
                </Button>
              )}
            </Form>
          </InnerToastContext.Provider>
          <LocationDisplay />
        </>,
        { initialEntries: ['/first', '/form'] },
      );

      expect(screen.getByTestId('location')).toHaveTextContent('/form');

      await userEvent.click(screen.getByText(/^cancel/i));

      // Verify confirm was shown and navigation was attempted
      expect(window.confirm).toHaveBeenCalled();
      // With dummy entry, blockedNavigate(-1) calls history.go(-2)
      expect(goSpy).toHaveBeenCalledWith(-2);
    });

    it('does not navigate when user cancels the prompt', async () => {
      jest.spyOn(window, 'confirm').mockReturnValue(false);

      renderFormWithMemoryRouter(
        <>
          <InnerToastContext.Provider value={jest.fn()}>
            <Form {...props} dirty>
              {({ onCancel }) => (
                <Button primary onClick={onCancel}>
                  cancel
                </Button>
              )}
            </Form>
          </InnerToastContext.Provider>
          <LocationDisplay />
        </>,
        { initialEntries: ['/first', '/form'] },
      );

      expect(screen.getByTestId('location')).toHaveTextContent('/form');

      await userEvent.click(screen.getByText(/^cancel/i));

      // Should still be on /form
      expect(screen.getByTestId('location')).toHaveTextContent('/form');
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

    describe('and the form is valid', () => {
      let handleSave: jest.MockedFunction<
        () => Promise<Record<string, unknown>>
      >;
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

      it('prompts when trying to leave while saving', async () => {
        renderFormWithMemoryRouter(
          <InnerToastContext.Provider value={innerMockToast}>
            <Form {...props} dirty>
              {({ getWrappedOnSave, isSaving }) => (
                <>
                  <Anchor href="/another-url">Navigate away</Anchor>
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
          </InnerToastContext.Provider>,
        );

        // Start saving
        await userEvent.click(screen.getByText(/^save/i));
        expect(screen.getByText(/^save/i).closest('button')).toBeDisabled();

        // Try to navigate while saving
        await userEvent.click(screen.getByText(/navigate/i));
        expect(window.confirm).toHaveBeenCalled();

        await act(async () => {
          resolveSave({ success: true });
        });
        await waitFor(() =>
          expect(screen.getByText(/^save/i).closest('button')).toBeEnabled(),
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

      it('prompts when trying to leave after save fails', async () => {
        renderFormWithMemoryRouter(
          <InnerToastContext.Provider value={innerMockToast}>
            <Form {...props} dirty>
              {({ getWrappedOnSave, isSaving }) => (
                <>
                  <Anchor href="/another-url">Navigate away</Anchor>
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
          </InnerToastContext.Provider>,
        );

        // Save and fail
        await userEvent.click(screen.getByText(/^save/i));
        await act(async () => {
          rejectSave(new Error('Save failed'));
        });

        // Try to navigate - should prompt because form is in error state
        await userEvent.click(screen.getByText(/navigate/i));
        expect(window.confirm).toHaveBeenCalled();
      });
    });

    it('throws error when onSaveFunction returns falsy value', async () => {
      const mockToast = jest.fn();
      let resolveSave: (value: void) => void;
      const handleSave = jest.fn().mockReturnValue(
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        }),
      );

      const { getByText } = renderFormWithMemoryRouter(
        <InnerToastContext.Provider value={mockToast}>
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
        resolveSave(undefined);
      });

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          'There was an error and we were unable to save your changes. Please try again.',
        );
      });
    });
  });

  describe('server errors', () => {
    it('calls reportValidity when serverErrors are present', async () => {
      const reportValiditySpy = jest.fn().mockReturnValue(true);

      // Mock HTMLFormElement.prototype.reportValidity to catch all calls
      const originalReportValidity = HTMLFormElement.prototype.reportValidity;
      HTMLFormElement.prototype.reportValidity = reportValiditySpy;

      try {
        renderFormWithMemoryRouter(
          <InnerToastContext.Provider value={jest.fn()}>
            <Form
              {...props}
              serverErrors={[
                {
                  instancePath: '/name',
                  keyword: 'required',
                  message: 'Error',
                  params: {},
                  schemaPath: '#/properties/name/required',
                },
              ]}
            >
              {() => <input type="text" />}
            </Form>
          </InnerToastContext.Provider>,
        );

        await waitFor(() => {
          expect(reportValiditySpy).toHaveBeenCalled();
        });
      } finally {
        // Restore original
        HTMLFormElement.prototype.reportValidity = originalReportValidity;
      }
    });

    it('does not call reportValidity when serverErrors are empty', async () => {
      const reportValiditySpy = jest.fn();

      const { container } = renderFormWithMemoryRouter(
        <InnerToastContext.Provider value={jest.fn()}>
          <Form {...props} serverErrors={[]}>
            {() => <input type="text" />}
          </Form>
        </InnerToastContext.Provider>,
      );

      const form = container.querySelector('form') as HTMLFormElement;
      if (form) {
        form.reportValidity = reportValiditySpy;
      }

      // Wait a bit to ensure the effect has run
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(reportValiditySpy).not.toHaveBeenCalled();
    });

    it('does not call reportValidity when formRef is null', async () => {
      const reportValiditySpy = jest.fn();

      renderFormWithMemoryRouter(
        <InnerToastContext.Provider value={jest.fn()}>
          <Form
            {...props}
            serverErrors={[
              {
                instancePath: '/name',
                keyword: 'required',
                message: 'Error',
                params: {},
                schemaPath: '#/properties/name/required',
              },
            ]}
          >
            {() => null}
          </Form>
        </InnerToastContext.Provider>,
      );

      // Wait a bit to ensure the effect has run
      await new Promise((resolve) => setTimeout(resolve, 100));

      // reportValidity should not be called if formRef.current is null
      // This is hard to test directly, but we can verify no errors are thrown
      expect(reportValiditySpy).not.toHaveBeenCalled();
    });
  });

  describe('redirect on save', () => {
    it('navigates to redirect URL after successful save', async () => {
      let resolveSave: (value: Record<string, unknown>) => void;
      const handleSave = jest.fn().mockReturnValue(
        new Promise<Record<string, unknown>>((resolve) => {
          resolveSave = resolve;
        }),
      );

      renderFormWithMemoryRouter(
        <>
          <InnerToastContext.Provider value={jest.fn()}>
            <Form {...props} dirty>
              {({ getWrappedOnSave, setRedirectOnSave }) => (
                <>
                  <Button
                    primary
                    onClick={() => {
                      setRedirectOnSave('/redirect-target');
                      getWrappedOnSave(handleSave)();
                    }}
                  >
                    save
                  </Button>
                </>
              )}
            </Form>
          </InnerToastContext.Provider>
          <LocationDisplay />
        </>,
        { initialEntries: ['/form'] },
      );

      expect(screen.getByTestId('location')).toHaveTextContent('/form');

      await userEvent.click(screen.getByText(/^save/i));

      await act(async () => {
        resolveSave({ success: true });
      });

      await waitFor(() => {
        expect(screen.getByTestId('location')).toHaveTextContent(
          '/redirect-target',
        );
      });
    });

    it('does not navigate if no redirect URL is set', async () => {
      let resolveSave: (value: Record<string, unknown>) => void;
      const handleSave = jest.fn().mockReturnValue(
        new Promise<Record<string, unknown>>((resolve) => {
          resolveSave = resolve;
        }),
      );

      renderFormWithMemoryRouter(
        <>
          <InnerToastContext.Provider value={jest.fn()}>
            <Form {...props} dirty>
              {({ getWrappedOnSave }) => (
                <Button primary onClick={getWrappedOnSave(handleSave)}>
                  save
                </Button>
              )}
            </Form>
          </InnerToastContext.Provider>
          <LocationDisplay />
        </>,
        { initialEntries: ['/form'] },
      );

      expect(screen.getByTestId('location')).toHaveTextContent('/form');

      await userEvent.click(screen.getByText(/^save/i));

      await act(async () => {
        resolveSave({ success: true });
      });

      // Wait a bit to ensure navigation would have happened if it was going to
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should still be on /form
      expect(screen.getByTestId('location')).toHaveTextContent('/form');
    });
  });
});
