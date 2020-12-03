import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
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

      userEvent.click(getByText(/save/i));
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

      userEvent.click(getByText(/save/i));
      expect(handleSave).toHaveBeenCalled();
      await waitFor(() =>
        expect(getByText(/save/i).closest('button')).toBeEnabled(),
      );
    });

    it('disables the save button while saving', async () => {
      let resolveSave!: () => void;
      const handleSave = () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        });
      const { getByText, unmount } = render(
        <EditModal title="Title" backHref="#" onSave={handleSave}>
          {() => null}
        </EditModal>,
      );

      userEvent.click(getByText(/save/i));
      expect(getByText(/save/i).closest('button')).toBeDisabled();

      unmount();
      act(resolveSave);
    });

    it('re-enables the save button after saving', async () => {
      let resolveSave!: () => void;
      const handleSave = () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        });
      const { getByText } = render(
        <EditModal title="Title" backHref="#" onSave={handleSave}>
          {() => null}
        </EditModal>,
      );

      userEvent.click(getByText(/save/i));
      act(resolveSave);

      await waitFor(() =>
        expect(getByText(/save/i).closest('button')).toBeEnabled(),
      );
    });
  });
});
