import React from 'react';
import { render, act, waitFor, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EditModal from '../EditModal';

it('renders a dialog with given title', () => {
  const { getByRole, getByText } = render(
    <EditModal title="Title" backHref="#">
      {() => null}
    </EditModal>,
  );
  expect(getByRole('dialog')).toContainElement(getByText('Title'));
});

it('renders a dialog with given children', () => {
  const { getByRole, getByText } = render(
    <EditModal title="Title" backHref="#">
      {() => 'Content'}
    </EditModal>,
  );
  expect(getByRole('dialog')).toContainElement(getByText('Content'));
});

describe('when saving', () => {
  describe('and the form is invalid', () => {
    it('does not call onSave', () => {
      const handleSave = jest.fn();
      const { getByText } = render(
        <EditModal title="Title" backHref="#" onSave={handleSave}>
          {() => <input type="text" required />}
        </EditModal>,
      );

      userEvent.click(getByText(/^save/i));
      expect(handleSave).not.toHaveBeenCalled();
    });
  });

  describe('and the form is valid', () => {
    it('calls onSave', async () => {
      const handleSave = jest.fn();
      const { getByText } = render(
        <EditModal title="Title" backHref="#" onSave={handleSave}>
          {() => null}
        </EditModal>,
      );

      userEvent.click(getByText(/^save/i));
      expect(handleSave).toHaveBeenCalled();
      await waitFor(() =>
        expect(getByText(/^save/i).closest('button')).toBeEnabled(),
      );
    });

    describe('and the save succeeds', () => {
      let resolveSave!: () => void;
      let result!: RenderResult;
      beforeEach(() => {
        const handleSave = () =>
          new Promise<void>((resolve) => {
            resolveSave = resolve;
          });
        result = render(
          <EditModal title="Title" backHref="#" onSave={handleSave}>
            {() => null}
          </EditModal>,
        );
      });

      it('disables the save button while saving', async () => {
        const { getByText, unmount } = result;

        userEvent.click(getByText(/^save/i));
        expect(getByText(/^save/i).closest('button')).toBeDisabled();

        unmount();
        act(resolveSave);
      });

      it('re-enables the save button after saving', async () => {
        const { getByText } = result;

        userEvent.click(getByText(/^save/i));
        act(resolveSave);

        await waitFor(() =>
          expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        );
      });
    });

    describe('and the save fails', () => {
      let rejectSave!: (error: Error) => void;
      let result!: RenderResult;
      beforeEach(() => {
        const handleSave = () =>
          new Promise<void>((_resolve, reject) => {
            rejectSave = reject;
          });
        result = render(
          <EditModal title="Title" backHref="#" onSave={handleSave}>
            {() => null}
          </EditModal>,
        );
      });

      it('shows an error message', async () => {
        const { getByText } = result;

        userEvent.click(getByText(/^save/i));
        act(() => rejectSave(new Error()));

        await waitFor(() => expect(getByText(/error/i)).toBeVisible());
      });

      it('re-enables the save button', async () => {
        const { getByText } = result;

        userEvent.click(getByText(/^save/i));
        act(() => rejectSave(new Error()));

        await waitFor(() =>
          expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        );
      });

      it('removes the error message when attempting to save again', async () => {
        const { getByText, queryByText, rerender, unmount } = result;

        userEvent.click(getByText(/^save/i));
        act(() => rejectSave(new Error()));
        await waitFor(() =>
          expect(getByText(/^save/i).closest('button')).toBeEnabled(),
        );

        let rejectSaveAgain!: (error: Error) => void;
        const handleSave = jest.fn().mockReturnValue(
          new Promise((_resolve, reject) => {
            rejectSaveAgain = reject;
          }),
        );
        rerender(
          <EditModal title="Title" backHref="#" onSave={handleSave}>
            {() => null}
          </EditModal>,
        );

        userEvent.click(getByText(/^save/i));
        expect(queryByText(/error/i)).not.toBeInTheDocument();

        unmount();
        act(() => rejectSaveAgain(new Error()));
      });
    });
  });
});
