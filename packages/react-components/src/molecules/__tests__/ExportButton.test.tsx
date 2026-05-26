import { ToastContext } from '@asap-hub/react-context';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';

import ExportButton from '../ExportButton';

const withToast = (children: ReactNode, toast: (node: ReactNode) => void) => (
  <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>
);

describe('ExportButton', () => {
  it('disables the clicked button and shows a spinner while exporting', async () => {
    let resolveExport: (() => void) | undefined;
    const exportResults = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveExport = resolve;
        }),
    );

    render(<ExportButton exportResults={exportResults} />);

    const button = screen.getByRole('button', { name: /CSV/i });
    await userEvent.click(button);

    expect(button).toBeDisabled();
    // Spinner replaces the export icon in-place; no <svg> in the button while
    // loading.
    expect(button.querySelector('[role="progressbar"]')).not.toBeNull();
    expect(button.querySelector('svg')).toBeNull();

    resolveExport!();
    await waitFor(() => expect(button).toBeEnabled());
  });

  it('ignores repeated clicks while an export is in flight', async () => {
    let resolveExport: (() => void) | undefined;
    const exportResults = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveExport = resolve;
        }),
    );

    render(<ExportButton exportResults={exportResults} />);

    const button = screen.getByRole('button', { name: /CSV/i });
    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);

    expect(exportResults).toHaveBeenCalledTimes(1);

    resolveExport!();
    await waitFor(() => expect(button).toBeEnabled());
  });

  it('tracks loading state per-button so siblings stay clickable', async () => {
    let resolveSlow: (() => void) | undefined;
    const slow = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSlow = resolve;
        }),
    );
    const fast = jest.fn(() => Promise.resolve());

    render(
      <ExportButton
        buttons={[
          { buttonText: 'Slow', errorMessage: 'slow err', exportResults: slow },
          { buttonText: 'Fast', errorMessage: 'fast err', exportResults: fast },
        ]}
      />,
    );

    const slowBtn = screen.getByRole('button', { name: /Slow/ });
    const fastBtn = screen.getByRole('button', { name: /Fast/ });

    await userEvent.click(slowBtn);
    expect(slowBtn).toBeDisabled();
    expect(fastBtn).toBeEnabled();

    await userEvent.click(fastBtn);
    expect(fast).toHaveBeenCalledTimes(1);
    expect(slowBtn).toBeDisabled();

    resolveSlow!();
    await waitFor(() => expect(slowBtn).toBeEnabled());
  });

  it('re-enables the button after an export rejects and toasts the error', async () => {
    const exportResults = jest.fn(() => Promise.reject(new Error('boom')));
    const toast = jest.fn();

    render(withToast(<ExportButton exportResults={exportResults} />, toast));

    const button = screen.getByRole('button', { name: /CSV/i });
    await userEvent.click(button);

    await waitFor(() => expect(button).toBeEnabled());
    expect(exportResults).toHaveBeenCalledTimes(1);
    expect(toast).toHaveBeenCalledWith(
      'There was an issue exporting to CSV. Please try again.',
    );
  });
});
