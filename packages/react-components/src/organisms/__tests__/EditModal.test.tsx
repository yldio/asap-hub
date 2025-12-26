import { ComponentProps, ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NavigationBlockerProvider } from '../../navigation';
import EditModal from '../EditModal';

const props: ComponentProps<typeof EditModal> = {
  title: 'Title',
  backHref: '/back',
  dirty: false,
  children: () => null,
};

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(window, 'confirm').mockImplementation(() => true);
});

afterEach(() => {
  jest.restoreAllMocks();
});

const renderModal = (children: ReactNode, { initialEntries = ['/'] } = {}) =>
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

describe('EditModal', () => {
  it('renders a dialog with given title', () => {
    renderModal(<EditModal {...props} title="Title" />);
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByText('Title'),
    );
  });

  it('renders a dialog with given children', () => {
    renderModal(<EditModal {...props}>{() => 'Content'}</EditModal>);
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByText('Content'),
    );
  });

  describe('navigation blocking', () => {
    it('does not prompt when trying to leave and form is not dirty', async () => {
      renderModal(<EditModal {...props} dirty={false} />);

      await userEvent.click(screen.getByTitle(/close/i));
      expect(window.confirm).not.toHaveBeenCalled();
    });

    it('prompts when trying to leave after making edits', async () => {
      renderModal(<EditModal {...props} dirty />);

      await userEvent.click(screen.getByTitle(/close/i));
      expect(window.confirm).toHaveBeenCalled();
    });

    it('navigates to backHref when not dirty', async () => {
      renderModal(
        <>
          <EditModal {...props} backHref="/back" dirty={false} />
          <LocationDisplay />
        </>,
        { initialEntries: ['/edit'] },
      );

      expect(screen.getByTestId('location')).toHaveTextContent('/edit');

      await userEvent.click(screen.getByTitle(/close/i));

      await waitFor(() => {
        expect(screen.getByTestId('location')).toHaveTextContent('/back');
      });
    });

    it('navigates to backHref when dirty and user confirms', async () => {
      jest.spyOn(window, 'confirm').mockReturnValue(true);

      renderModal(
        <>
          <EditModal {...props} backHref="/back" dirty />
          <LocationDisplay />
        </>,
        { initialEntries: ['/edit'] },
      );

      await userEvent.click(screen.getByTitle(/close/i));

      await waitFor(() => {
        expect(screen.getByTestId('location')).toHaveTextContent('/back');
      });
    });

    it('does not navigate when dirty and user cancels', async () => {
      jest.spyOn(window, 'confirm').mockReturnValue(false);

      renderModal(
        <>
          <EditModal {...props} backHref="/back" dirty />
          <LocationDisplay />
        </>,
        { initialEntries: ['/edit'] },
      );

      await userEvent.click(screen.getByTitle(/close/i));

      // Should still be on /edit
      expect(screen.getByTestId('location')).toHaveTextContent('/edit');
    });
  });

  describe('when saving', () => {
    describe('and the form is invalid', () => {
      it('does not call onSave', async () => {
        const handleSave = jest.fn();
        renderModal(
          <EditModal {...props} onSave={handleSave} dirty>
            {({ isSaving }, asyncWrapper) => (
              <>
                <input type="text" required />
                <button type="button" onClick={() => asyncWrapper(handleSave)}>
                  Save
                </button>
              </>
            )}
          </EditModal>,
        );

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await userEvent.click(saveButton);
        expect(handleSave).not.toHaveBeenCalled();
      });

      it('does not call onSave when parent validation fails', async () => {
        const handleSave = jest.fn(() => Promise.resolve());
        const handleValidate = jest.fn(() => false);
        renderModal(
          <EditModal
            {...props}
            validate={handleValidate}
            onSave={handleSave}
            dirty
          >
            {({ isSaving }, asyncWrapper) => (
              <>
                <input type="text" />
                <button type="button" onClick={() => asyncWrapper(handleSave)}>
                  Save
                </button>
              </>
            )}
          </EditModal>,
        );

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await userEvent.click(saveButton);

        expect(handleValidate).toHaveBeenCalled();
        expect(handleSave).not.toHaveBeenCalled();
      });
    });

    describe('and the form is valid', () => {
      const renderEditModal = ({ handleSave = jest.fn() } = {}) => {
        renderModal(
          <>
            <EditModal {...props} backHref="/back" onSave={handleSave} dirty>
              {({ isSaving }, asyncWrapper) => (
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => asyncWrapper(handleSave)}
                >
                  Save
                </button>
              )}
            </EditModal>
            <LocationDisplay />
          </>,
          { initialEntries: ['/edit'] },
        );
        return { handleSave };
      };

      it('calls onSave', async () => {
        const handleSave = jest.fn().mockResolvedValue(null);
        renderEditModal({ handleSave });

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await userEvent.click(saveButton);
        expect(handleSave).toHaveBeenCalled();

        await waitFor(() => expect(saveButton).toBeEnabled());
      });

      it('disables the save button while saving', async () => {
        let resolveSave!: () => void;
        const savePromise = new Promise<void>((resolve) => {
          resolveSave = resolve;
        });
        const handleSave = jest.fn().mockReturnValue(savePromise);
        renderEditModal({ handleSave });
        const saveButton = screen.getByRole('button', { name: 'Save' });
        await userEvent.click(saveButton);

        await waitFor(() => expect(saveButton).toBeDisabled());

        resolveSave();
        await waitFor(() => expect(saveButton).toBeEnabled());
      });

      it('prompts when trying to leave while saving', async () => {
        let resolveSave!: () => void;
        const savePromise = new Promise<void>((resolve) => {
          resolveSave = resolve;
        });
        const handleSave = jest.fn().mockReturnValue(savePromise);
        renderEditModal({ handleSave });

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await userEvent.click(saveButton);

        // While saving, try to close
        await userEvent.click(screen.getByTitle(/close/i));
        expect(window.confirm).toHaveBeenCalled();

        resolveSave();
        await waitFor(() => expect(saveButton).toBeEnabled());
      });

      describe('and the save succeeds', () => {
        it('navigates to the back href', async () => {
          const handleSave = jest.fn().mockResolvedValue(null);
          renderEditModal({ handleSave });

          const saveButton = screen.getByRole('button', { name: 'Save' });
          await userEvent.click(saveButton);

          await waitFor(() => {
            expect(screen.getByTestId('location')).toHaveTextContent('/back');
          });
        });

        it('re-enables the save button', async () => {
          const handleSave = jest.fn().mockResolvedValue(null);
          renderEditModal({ handleSave });

          const saveButton = screen.getByRole('button', { name: 'Save' });
          await userEvent.click(saveButton);
          await waitFor(() => expect(saveButton).toBeEnabled());
        });
      });

      describe('and the save fails', () => {
        it('shows an error message', async () => {
          const handleSave = jest.fn().mockRejectedValueOnce(new Error());
          renderEditModal({ handleSave });

          const saveButton = screen.getByRole('button', { name: 'Save' });
          await userEvent.click(saveButton);

          await waitFor(() =>
            expect(screen.getByTitle(/error icon/i)).toBeInTheDocument(),
          );
        });

        it('re-enables the save button', async () => {
          const handleSave = jest.fn().mockRejectedValueOnce(new Error());
          renderEditModal({ handleSave });

          const saveButton = screen.getByRole('button', { name: 'Save' });
          await userEvent.click(saveButton);

          await waitFor(() =>
            expect(screen.getByText(/^save/i).closest('button')).toBeEnabled(),
          );
        });

        it('prompts when trying to leave after save fails', async () => {
          const handleSave = jest.fn().mockRejectedValueOnce(new Error());
          renderEditModal({ handleSave });

          const saveButton = screen.getByRole('button', { name: 'Save' });
          await userEvent.click(saveButton);

          // Wait for error state
          await waitFor(() =>
            expect(screen.getByTitle(/error icon/i)).toBeInTheDocument(),
          );

          // Try to close - should prompt because form has error
          await userEvent.click(screen.getByTitle(/close/i));
          expect(window.confirm).toHaveBeenCalled();
        });

        it('removes the error message when attempting to save again', async () => {
          let resolveSecondSave!: () => void;
          const secondSavePromise = new Promise<void>((resolve) => {
            resolveSecondSave = resolve;
          });
          const handleSave = jest
            .fn()
            .mockRejectedValueOnce(new Error())
            .mockReturnValueOnce(secondSavePromise);

          renderEditModal({ handleSave });

          const saveButton = screen.getByRole('button', { name: 'Save' });

          // First save fails - error message should appear
          await userEvent.click(saveButton);
          await waitFor(() =>
            expect(screen.getByTitle(/error icon/i)).toBeInTheDocument(),
          );

          // Click save again - error message should be cleared while saving
          await userEvent.click(saveButton);
          expect(screen.queryByTitle(/error icon/i)).not.toBeInTheDocument();

          // Complete the second save
          resolveSecondSave();
          await waitFor(() => expect(saveButton).toBeEnabled());
        });
      });
    });
  });
});
