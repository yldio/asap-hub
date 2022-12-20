import { ComponentProps } from 'react';
import { Router, MemoryRouter, StaticRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EditModal from '../EditModal';

const props: ComponentProps<typeof EditModal> = {
  title: 'Title',
  backHref: '#',
  dirty: false,
  children: () => null,
};
beforeEach(jest.resetAllMocks);

it('renders a dialog with given title', () => {
  render(<EditModal {...props} title="Title" />, { wrapper: MemoryRouter });
  expect(screen.getByRole('dialog')).toContainElement(
    screen.getByText('Title'),
  );
});

it('renders a dialog with given children', () => {
  render(<EditModal {...props}>{() => 'Content'}</EditModal>, {
    wrapper: MemoryRouter,
  });
  expect(screen.getByRole('dialog')).toContainElement(
    screen.getByText('Content'),
  );
});

it('initially does not prompt when trying to leave', () => {
  const getUserConfirmation = jest.fn((_message, cb) => cb(true));
  const history = createMemoryHistory({ getUserConfirmation });
  render(
    <Router history={history}>
      <EditModal {...props} />
    </Router>,
  );

  userEvent.click(screen.getByTitle(/close/i));
  expect(getUserConfirmation).not.toHaveBeenCalled();
});
it('prompts when trying to leave after making edits', () => {
  const getUserConfirmation = jest.fn((_message, cb) => cb(true));
  const history = createMemoryHistory({ getUserConfirmation });
  render(
    <Router history={history}>
      <EditModal {...props} dirty />
    </Router>,
  );

  userEvent.click(screen.getByTitle(/close/i));
  expect(getUserConfirmation).toHaveBeenCalled();
});

describe('when saving', () => {
  describe('and the form is invalid', () => {
    it('does not call onSave', () => {
      const handleSave = jest.fn();
      render(
        <EditModal {...props} onSave={handleSave} dirty>
          {() => <input type="text" required />}
        </EditModal>,
        { wrapper: MemoryRouter },
      );

      const saveButton = screen.getByRole('button', { name: 'Save' });
      userEvent.click(saveButton);
      expect(handleSave).not.toHaveBeenCalled();
    });

    it('does not call onSave when parent validation fails', () => {
      const handleSave = jest.fn(() => Promise.resolve());
      const handleValidate = jest.fn(() => false);
      render(
        <EditModal
          {...props}
          validate={handleValidate}
          onSave={handleSave}
          dirty
        >
          {() => <input type="text" />}
        </EditModal>,
        { wrapper: StaticRouter },
      );

      const saveButton = screen.getByRole('button', { name: 'Save' });
      userEvent.click(saveButton);

      expect(handleValidate).toHaveBeenCalled();
      expect(handleSave).not.toHaveBeenCalled();
    });
  });

  describe('and the form is valid', () => {
    const renderEditModal = ({ handleSave = jest.fn() } = {}) => {
      const getUserConfirmation = jest.fn((_message, cb) => cb(true));
      const history = createMemoryHistory({ getUserConfirmation });
      const { rerender } = render(
        <Router history={history}>
          <EditModal {...props} backHref="/back" onSave={handleSave} dirty />
        </Router>,
      );
      return { rerender, getUserConfirmation, history, handleSave };
    };

    it('calls onSave', async () => {
      const handleSave = jest.fn().mockResolvedValue(null);
      renderEditModal({ handleSave });

      const saveButton = screen.getByRole('button', { name: 'Save' });
      userEvent.click(saveButton);
      expect(handleSave).toHaveBeenCalled();

      await waitFor(() => expect(saveButton).toBeEnabled());
    });

    it('disables the save button while saving', async () => {
      const handleSave = jest.fn().mockResolvedValue(null);
      renderEditModal({ handleSave });
      const saveButton = screen.getByRole('button', { name: 'Save' });
      userEvent.click(saveButton);
      expect(saveButton).toBeDisabled();

      await waitFor(() => expect(saveButton).toBeEnabled());
    });

    it('prompts when trying to leave while saving', async () => {
      const handleSave = jest.fn().mockResolvedValue(null);
      const { getUserConfirmation } = renderEditModal({ handleSave });
      const saveButton = screen.getByRole('button', { name: 'Save' });
      userEvent.click(saveButton);

      userEvent.click(screen.getByTitle(/close/i));
      expect(getUserConfirmation).toHaveBeenCalled();

      await waitFor(() => expect(saveButton).toBeEnabled());
    });

    describe('and the save succeeds', () => {
      it('navigates to the back href without prompting', async () => {
        const handleSave = jest.fn().mockResolvedValue(null);
        const { history, getUserConfirmation } = renderEditModal({
          handleSave,
        });

        const saveButton = screen.getByRole('button', { name: 'Save' });
        userEvent.click(saveButton);
        await waitFor(() => {
          expect(history.location.pathname).toBe('/back');
        });
        expect(getUserConfirmation).not.toHaveBeenCalled();
      });

      it('re-enables the save button', async () => {
        const handleSave = jest.fn().mockResolvedValue(null);
        renderEditModal({ handleSave });

        const saveButton = screen.getByRole('button', { name: 'Save' });
        userEvent.click(saveButton);
        await waitFor(() => expect(saveButton).toBeEnabled());
      });

      // hypothetical cases if navigating back has not already caused unmount
      describe('and the modal is still open', () => {
        it('does not prompt when trying to leave', async () => {
          const handleSave = jest.fn().mockResolvedValue(null);
          const { history, getUserConfirmation, rerender } = renderEditModal({
            handleSave,
          });

          const saveButton = screen.getByRole('button', { name: 'Save' });
          userEvent.click(saveButton);
          await waitFor(() => expect(saveButton).toBeEnabled());

          // not going to be dirty anymore since the values have just been saved
          rerender(
            <Router history={history}>
              <EditModal {...props} backHref="/back" onSave={handleSave} />
            </Router>,
          );
          userEvent.click(screen.getByTitle(/close/i));
          expect(getUserConfirmation).not.toHaveBeenCalled();

          await waitFor(() =>
            expect(screen.getByText(/^save/i).closest('button')).toBeEnabled(),
          );
        });

        it('prompts when trying to leave after making edits again', async () => {
          const handleSave = jest.fn().mockResolvedValue(null);
          const { history, getUserConfirmation, rerender } = renderEditModal({
            handleSave,
          });
          rerender(
            <Router history={history}>
              <EditModal
                {...props}
                backHref="/back"
                onSave={handleSave}
                dirty
              />
            </Router>,
          );
          userEvent.click(screen.getByTitle(/close/i));
          expect(getUserConfirmation).toHaveBeenCalled();

          await waitFor(() =>
            expect(screen.getByText(/^save/i).closest('button')).toBeEnabled(),
          );
        });
      });
    });

    describe('and the save fails', () => {
      it('shows an error message', async () => {
        const handleSave = jest.fn().mockRejectedValueOnce(new Error());
        renderEditModal({ handleSave });

        const saveButton = screen.getByRole('button', { name: 'Save' });
        userEvent.click(saveButton);

        await waitFor(() =>
          expect(screen.getByTitle(/error icon/i)).toBeInTheDocument(),
        );
      });

      it('re-enables the save button', async () => {
        const handleSave = jest.fn().mockRejectedValueOnce(new Error());
        renderEditModal({ handleSave });

        const saveButton = screen.getByRole('button', { name: 'Save' });
        userEvent.click(saveButton);

        await waitFor(() =>
          expect(screen.getByText(/^save/i).closest('button')).toBeEnabled(),
        );
      });

      it('prompts when trying to leave', async () => {
        const handleSave = jest.fn().mockRejectedValueOnce(new Error());
        const { getUserConfirmation } = renderEditModal({ handleSave });

        const saveButton = screen.getByRole('button', { name: 'Save' });
        userEvent.click(saveButton);

        userEvent.click(screen.getByTitle(/close/i));
        expect(getUserConfirmation).toHaveBeenCalled();

        await waitFor(() => expect(saveButton).toBeEnabled());
      });

      it('removes the error message when attempting to save again', async () => {
        const handleSave = jest.fn().mockRejectedValueOnce(new Error());
        const { rerender, history } = renderEditModal({ handleSave });

        const saveButton = screen.getByRole('button', { name: 'Save' });
        userEvent.click(saveButton);
        await waitFor(() => expect(saveButton).toBeEnabled());

        const handleSaveAgain = jest.fn().mockRejectedValue(new Error());
        rerender(
          <Router history={history}>
            <EditModal {...props} onSave={handleSaveAgain} dirty />
          </Router>,
        );

        userEvent.click(saveButton);
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
        await waitFor(() => expect(saveButton).toBeEnabled());
      });
    });
  });
});
