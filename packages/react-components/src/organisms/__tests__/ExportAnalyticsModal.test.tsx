import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import ExportAnalyticsModal from '../ExportAnalyticsModal';

const renderModal = (children: ReactNode) =>
  render(<MemoryRouter>{children}</MemoryRouter>);

describe('ExportAnalyticsModal', () => {
  const defaultProps: ComponentProps<typeof ExportAnalyticsModal> = {
    onDismiss: jest.fn(),
    onDownload: jest.fn(),
  };

  it('renders title, data range and metrics to export', () => {
    const { container } = renderModal(
      <ExportAnalyticsModal {...defaultProps} />,
    );

    expect(container).toHaveTextContent(/Export XLSX/i);
    expect(container).toHaveTextContent(/Select data range/i);
    expect(container).toHaveTextContent(/Select metrics to export/i);
  });

  it('calls onDismiss when user clicks on "Cancel" button', () => {
    const onDismiss = jest.fn();
    renderModal(
      <ExportAnalyticsModal {...defaultProps} onDismiss={onDismiss} />,
    );

    userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onDismiss).toHaveBeenCalled();
  });

  it('calls onDismiss when user clicks on "Close" button', () => {
    const onDismiss = jest.fn();
    renderModal(
      <ExportAnalyticsModal {...defaultProps} onDismiss={onDismiss} />,
    );

    userEvent.click(screen.getByTitle(/close/i));

    expect(onDismiss).toHaveBeenCalled();
  });

  it('calls onDismiss after downloading the data', async () => {
    const onDismiss = jest.fn();
    const onDownload = jest.fn();
    renderModal(
      <ExportAnalyticsModal
        {...defaultProps}
        onDownload={onDownload}
        onDismiss={onDismiss}
      />,
    );

    userEvent.click(screen.getByText(/Choose a data range/i));
    userEvent.click(screen.getByText(/This year/i));

    userEvent.click(
      screen.getByRole('checkbox', { name: /Team Productivity/i }),
    );

    const exportButton = screen.getByRole('button', { name: /export/i });
    userEvent.click(exportButton);
    await waitFor(() => {
      expect(onDownload).toHaveBeenCalledWith(
        'current-year',
        new Set(['team-productivity']),
      );
    });

    expect(onDismiss).toHaveBeenCalled();
  });

  it('the export button becomes enabled when user selects time range and at least one metric to export', async () => {
    renderModal(<ExportAnalyticsModal {...defaultProps} />);

    const exportButton = screen.getByRole('button', { name: /export/i });
    expect(exportButton).toBeDisabled();

    userEvent.click(screen.getByText(/Choose a data range/i));
    userEvent.click(screen.getByText(/Last 12 months/i));
    expect(exportButton).toBeDisabled();

    userEvent.click(
      screen.getByRole('checkbox', { name: /Team Productivity/i }),
    );

    expect(exportButton).toBeEnabled();
  });

  it('unselects metric option if user clicks on it twice', async () => {
    const onDownload = jest.fn();
    renderModal(
      <ExportAnalyticsModal {...defaultProps} onDownload={onDownload} />,
    );
    const exportButton = screen.getByRole('button', { name: /export/i });

    userEvent.click(screen.getByText(/Choose a data range/i));
    userEvent.click(screen.getByText(/This year/i));
    expect(exportButton).toBeDisabled();

    userEvent.click(
      screen.getByRole('checkbox', { name: /Team Productivity/i }),
    );
    expect(exportButton).toBeEnabled();

    userEvent.click(
      screen.getByRole('checkbox', { name: /Team Productivity/i }),
    );
    expect(exportButton).toBeDisabled();
  });

  it('calls onDownload with selected options', async () => {
    const onDownload = jest.fn();
    renderModal(
      <ExportAnalyticsModal {...defaultProps} onDownload={onDownload} />,
    );

    userEvent.click(screen.getByText(/Choose a data range/i));
    userEvent.click(screen.getByText(/This year/i));

    userEvent.click(
      screen.getByRole('checkbox', { name: /Team Productivity/i }),
    );

    userEvent.click(
      screen.getByRole('checkbox', {
        name: /Team Co-Production: Within Team/i,
      }),
    );

    userEvent.click(screen.getByRole('checkbox', { name: /Interest Groups/i }));

    userEvent.click(
      screen.getByRole('checkbox', { name: /Speaker Diversity/i }),
    );

    const exportButton = screen.getByRole('button', { name: /export/i });
    userEvent.click(exportButton);
    await waitFor(() => {
      expect(onDownload).toHaveBeenCalledWith(
        'current-year',
        new Set([
          'team-productivity',
          'team-collaboration-within',
          'ig-leadership',
          'engagement',
        ]),
      );
    });
  });

  it('changes the text to "Exporting..." and disables buttons while downloading', async () => {
    const onDownload = jest.fn(() => Promise.resolve());
    renderModal(
      <ExportAnalyticsModal {...defaultProps} onDownload={onDownload} />,
    );

    userEvent.click(screen.getByText(/Choose a data range/i));
    userEvent.click(screen.getByText(/Since Hub Launch/i));

    userEvent.click(
      screen.getByRole('checkbox', { name: /Team Productivity/i }),
    );
    const exportButton = screen.getByRole('button', { name: /export/i });
    userEvent.click(exportButton);

    expect(exportButton).toHaveTextContent('Exporting...');
    expect(exportButton).toBeDisabled();

    expect(screen.getByLabelText(/time range/i)).toBeDisabled();
    expect(
      screen.getByRole('checkbox', { name: /User Productivity/i }),
    ).toBeDisabled();

    await waitFor(() => {
      expect(exportButton).toHaveTextContent('Export XLSX');
      expect(exportButton).toBeEnabled();
    });
  });
});
