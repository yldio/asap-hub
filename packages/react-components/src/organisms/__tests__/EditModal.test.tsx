import { ComponentProps } from 'react';
import { Router, MemoryRouter, StaticRouter } from 'react-router-dom';
import { History, createMemoryHistory } from 'history';
import { render, act, waitFor, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EditModal from '../EditModal';

const props: ComponentProps<typeof EditModal> = {
  title: 'Title',
  backHref: '#',
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

it('renders a dialog with given title', () => {
  const { getByRole, getByText } = render(
    <EditModal {...props} title="Title" />,
    { wrapper: MemoryRouter },
  );
  expect(getByRole('dialog')).toContainElement(getByText('Title'));
});

it('renders a dialog with given children', () => {
  const { getByRole, getByText } = render(
    <EditModal {...props}>{() => 'Content'}</EditModal>,
    { wrapper: MemoryRouter },
  );
  expect(getByRole('dialog')).toContainElement(getByText('Content'));
});

it('initially does not prompt when trying to leave', () => {
  const { getByTitle } = render(
    <Router history={history}>
      <EditModal {...props} />
    </Router>,
  );

  userEvent.click(getByTitle(/close/i));
  expect(getUserConfirmation).not.toHaveBeenCalled();
});
it('prompts when trying to leave after making edits', () => {
  const { getByTitle } = render(
    <Router history={history}>
      <EditModal {...props} dirty />
    </Router>,
  );

  userEvent.click(getByTitle(/close/i));
  expect(getUserConfirmation).toHaveBeenCalled();
});

describe('when saving', () => {
  describe('and the form is invalid', () => {
    it('does not call onSave', () => {
      const handleSave = jest.fn();
      const { getByText } = render(
        <EditModal {...props} onSave={handleSave} dirty>
          {() => <input type="text" required />}
        </EditModal>,
        { wrapper: MemoryRouter },
      );

      userEvent.click(getByText(/^save/i));
      expect(handleSave).not.toHaveBeenCalled();
    });

    it('does not call onSave when parent validation fails', () => {
      const handleSave = jest.fn(() => Promise.resolve());
      const handleValidate = jest.fn(() => false);
      const { getByText } = render(
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

    beforeEach(() => {
      handleSave = jest.fn().mockReturnValue(
        new Promise<void>((resolve, reject) => {
          resolveSave = resolve;
          rejectSave = reject;
        }),
      );
      history = createMemoryHistory({ getUserConfirmation });
      result = render(
        <Router history={history}>
          <EditModal {...props} backHref="/back" onSave={handleSave} dirty />
        </Router>,
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
      const { getByText, getByTitle, unmount } = result;
      userEvent.click(getByText(/^save/i));

      userEvent.click(getByTitle(/close/i));
      expect(getUserConfirmation).toHaveBeenCalled();

      unmount();
      resolveSave();
    });

    describe('and the save succeeds', () => {
      beforeEach(() => {
        act(resolveSave);
      });

      it('navigates to the back href without prompting', async () => {
        const { getByText } = result;

        userEvent.click(getByText(/^save/i));
        await waitFor(() => {
          expect(history.location.pathname).toBe('/back');
        });
        expect(getUserConfirmation).not.toHaveBeenCalled();
      });

      it('re-enables the save button', async () => {
        const { getByText } = result;

        userEvent.click(getByText(/^save/i));
        await waitFor(() =>
          expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        );
      });

      // hypothetical cases if navigating back has not already caused unmount
      describe('and the modal is still open', () => {
        beforeEach(async () => {
          const { getByText, rerender } = result;

          userEvent.click(getByText(/^save/i));
          await waitFor(() =>
            expect(getByText(/^save/i).closest('button')).toBeEnabled(),
          );

          // not going to be dirty anymore since the values have just been saved
          rerender(
            <Router history={history}>
              <EditModal {...props} backHref="/back" onSave={handleSave} />
            </Router>,
          );
        });

        it('does not prompt when trying to leave', async () => {
          const { getByTitle, getByText } = result;
          userEvent.click(getByTitle(/close/i));
          expect(getUserConfirmation).not.toHaveBeenCalled();

          await waitFor(() =>
            expect(getByText(/^save/i).closest('button')).toBeEnabled(),
          );
        });

        it('prompts when trying to leave after making edits again', async () => {
          const { rerender, getByTitle, getByText } = result;
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

          userEvent.click(getByTitle(/close/i));
          expect(getUserConfirmation).toHaveBeenCalled();

          await waitFor(() =>
            expect(getByText(/^save/i).closest('button')).toBeEnabled(),
          );
        });
      });
    });

    describe('and the save fails', () => {
      beforeEach(() => {
        act(() => rejectSave(new Error()));
      });

      it('shows an error message', async () => {
        const { getByText, getByTitle } = result;

        userEvent.click(getByText(/^save/i));

        await waitFor(() =>
          expect(getByTitle(/error icon/i)).toBeInTheDocument(),
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
        const { getByText, getByTitle } = result;
        userEvent.click(getByText(/^save/i));

        userEvent.click(getByTitle(/close/i));
        expect(getUserConfirmation).toHaveBeenCalled();

        await waitFor(() =>
          expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        );
      });

      it('removes the error message when attempting to save again', async () => {
        const { getByText, queryByText, rerender, unmount } = result;

        userEvent.click(getByText(/^save/i));
        await waitFor(() =>
          expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        );

        let rejectSaveAgain!: (error: Error) => void;
        const handleSaveAgain = jest.fn().mockReturnValue(
          new Promise((_resolve, reject) => {
            rejectSaveAgain = reject;
          }),
        );
        rerender(
          <Router history={history}>
            <EditModal {...props} onSave={handleSaveAgain} dirty />
          </Router>,
        );

        userEvent.click(getByText(/^save/i));
        expect(queryByText(/error/i)).not.toBeInTheDocument();

        unmount();
        act(() => rejectSaveAgain(new Error()));
      });
    });
  });
});
