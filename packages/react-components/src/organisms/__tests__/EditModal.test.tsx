import { ComponentProps, ReactNode } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, waitFor, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EditModal from '../EditModal';

global['Request'] = jest.fn().mockImplementation(() => ({
  signal: {
    removeEventListener: () => {},
    addEventListener: () => {},
  },
}));

const props: ComponentProps<typeof EditModal> = {
  title: 'Title',
  backHref: '#',
  dirty: false,
  children: () => null,
};

const backRoute = {
  path: '/back',
  element: 'back',
};
const renderComponent = (element: ReactNode) => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element,
      },
      backRoute,
    ],
    {
      initialEntries: ['/'],
      initialIndex: 0,
    },
  );
  return render(<RouterProvider router={router} />);
};

const expectPromptVisible = (visible = true) => {
  if (visible) {
    expect(
      screen.getByText(/Are you sure you want to leave.+/i),
    ).toBeInTheDocument();
  } else {
    expect(
      screen.queryByText(/Are you sure you want to leave.+/i),
    ).not.toBeInTheDocument();
  }
};

it('renders a dialog with given title', () => {
  renderComponent(<EditModal {...props} title="Title" />);
  expect(screen.getByRole('dialog')).toContainElement(
    screen.getByText('Title'),
  );
});

it('renders a dialog with given children', () => {
  renderComponent(<EditModal {...props}>{() => 'Content'}</EditModal>);
  expect(screen.getByRole('dialog')).toContainElement(
    screen.getByText('Content'),
  );
});

it('initially does not prompt when trying to leave', async () => {
  renderComponent(<EditModal {...props} />);

  await userEvent.click(screen.getByTitle(/close/i));
  expectPromptVisible(false);
});

it('prompts when trying to leave after making edits', async () => {
  renderComponent(
    <EditModal {...props} dirty>
      {() => 'Content'}
    </EditModal>,
  );

  await userEvent.click(screen.getByTitle(/close/i));
  expect(
    screen.getByText(/Are you sure you want to leave.+/i),
  ).toBeInTheDocument();
});

describe('when saving', () => {
  describe('and the form is invalid', () => {
    it('does not call onSave', async () => {
      const handleSave = jest.fn();
      renderComponent(
        <EditModal {...props} onSave={handleSave} dirty>
          {() => <input type="text" required />}
        </EditModal>,
      );

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await userEvent.click(saveButton);
      expect(handleSave).not.toHaveBeenCalled();
    });

    it('does not call onSave when parent validation fails', async () => {
      const handleSave = jest.fn(() => Promise.resolve());
      const handleValidate = jest.fn(() => false);
      renderComponent(
        <EditModal
          {...props}
          validate={handleValidate}
          onSave={handleSave}
          dirty
        >
          {() => <input type="text" />}
        </EditModal>,
      );

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await userEvent.click(saveButton);

      expect(handleValidate).toHaveBeenCalled();
      expect(handleSave).not.toHaveBeenCalled();
    });
  });

  describe('and the form is valid', () => {
    let router = createMemoryRouter([{ path: '/', element: <></> }]);
    const renderEditModal = ({ handleSave = jest.fn() } = {}) => {
      router = createMemoryRouter([
        {
          path: '/',
          element: (
            <EditModal {...props} backHref="/back" onSave={handleSave} dirty />
          ),
        },
        backRoute,
      ]);
      const { rerender } = render(<RouterProvider router={router} />);
      return { rerender, handleSave };
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
      const handleSave = jest.fn().mockResolvedValue(null);
      renderEditModal({ handleSave });
      const saveButton = screen.getByRole('button', { name: 'Save' });
      await userEvent.click(saveButton);
      expect(saveButton).toBeDisabled();

      await waitFor(() => expect(saveButton).toBeEnabled());
    });

    it('prompts when trying to leave while saving', async () => {
      const handleSave = jest.fn().mockResolvedValue(null);
      renderEditModal({ handleSave });
      const saveButton = screen.getByRole('button', { name: 'Save' });
      await userEvent.click(saveButton);

      await userEvent.click(screen.getByTitle(/close/i));
      expectPromptVisible();

      await waitFor(() => expect(saveButton).toBeEnabled());
    });

    describe('and the save succeeds', () => {
      it('navigates to the back href without prompting', async () => {
        const handleSave = jest.fn().mockResolvedValue(null);
        renderEditModal({
          handleSave,
        });

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await userEvent.click(saveButton);
        await waitFor(() => {
          expect(router.state.location.pathname).toBe('/back');
        });
        expectPromptVisible(false);
      });

      it('re-enables the save button', async () => {
        const handleSave = jest.fn().mockResolvedValue(null);
        renderEditModal({ handleSave });

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await userEvent.click(saveButton);
        await waitFor(() => expect(saveButton).toBeEnabled());
      });

      // hypothetical cases if navigating back has not already caused unmount
      describe.skip('and the modal is still open', () => {
        it('does not prompt when trying to leave', async () => {
          const handleSave = jest.fn().mockResolvedValue(null);
          const { rerender } = renderEditModal({
            handleSave,
          });

          const saveButton = screen.getByRole('button', { name: 'Save' });
          await userEvent.click(saveButton);
          await waitFor(() => expect(saveButton).toBeEnabled());

          router = createMemoryRouter([
            {
              path: '/',
              element: (
                <EditModal {...props} backHref="/back" onSave={handleSave} />
              ),
            },
            backRoute,
          ]);
          // not going to be dirty anymore since the values have just been saved
          rerender(<RouterProvider router={router} />);

          await userEvent.click(screen.getByTitle(/close/i));

          expectPromptVisible(false);

          await waitFor(() =>
            expect(screen.getByText(/^save/i).closest('button')).toBeEnabled(),
          );
        });

        it('prompts when trying to leave after making edits again', async () => {
          const handleSave = jest.fn().mockResolvedValue(null);
          const { rerender } = renderEditModal({
            handleSave,
          });
          rerender(<RouterProvider router={router} />);
          await userEvent.click(screen.getByTitle(/close/i));
          expectPromptVisible();
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

      it.skip('prompts when trying to leave', async () => {
        const handleSave = jest.fn().mockRejectedValueOnce(new Error());
        renderEditModal({ handleSave });

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await userEvent.click(saveButton);

        await userEvent.click(screen.getByTitle(/close/i));
        expectPromptVisible();
        await waitFor(() => expect(saveButton).toBeEnabled());
      });

      it.skip('removes the error message when attempting to save again', async () => {
        let handleSave!: jest.MockedFunction<any>;
        let resolveSave!: () => void;
        let rejectSave!: (error: Error) => void;

        handleSave = jest.fn().mockRejectedValueOnce(new Error());
        const { rerender } = renderEditModal({ handleSave });
        const saveButton = screen.getByRole('button', { name: 'Save' });

        await userEvent.click(saveButton);
        await waitFor(() => expect(saveButton).toBeEnabled());

        handleSave = jest.fn().mockReturnValue(
          new Promise<void>((resolve, reject) => {
            resolveSave = resolve;
            rejectSave = reject;
          }),
        );

        router = createMemoryRouter([
          {
            path: '/',
            element: (
              <EditModal
                {...props}
                backHref="/back"
                onSave={handleSave}
                dirty
              />
            ),
          },
          backRoute,
        ]);

        rerender(<RouterProvider router={router} />);

        await userEvent.click(saveButton);
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
        act(resolveSave);
        await waitFor(() => expect(saveButton).toBeEnabled());
      });
    });
  });
});
