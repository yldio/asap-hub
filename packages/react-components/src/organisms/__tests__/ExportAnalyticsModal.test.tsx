import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useFlags } from '@asap-hub/react-context';

import ExportAnalyticsModal from '../ExportAnalyticsModal';

jest.mock('@asap-hub/react-context', () => ({
  useFlags: jest.fn(),
}));

const mockUseFlags = useFlags as jest.MockedFunction<typeof useFlags>;

const renderModal = (children: ReactNode) =>
  render(<MemoryRouter>{children}</MemoryRouter>);

describe('ExportAnalyticsModal', () => {
  const defaultProps: ComponentProps<typeof ExportAnalyticsModal> = {
    onDismiss: jest.fn(),
    onDownload: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Default: feature flag disabled
    mockUseFlags.mockReturnValue({
      isEnabled: jest.fn().mockReturnValue(false),
      enable: jest.fn(),
      disable: jest.fn(),
      reset: jest.fn(),
      setCurrentOverrides: jest.fn(),
      setEnvironment: jest.fn(),
    });
  });

  it('renders title, data range and metrics to export', () => {
    const { container } = renderModal(
      <ExportAnalyticsModal {...defaultProps} />,
    );

    expect(container).toHaveTextContent(/Download Multiple XLSX/i);
    expect(container).toHaveTextContent(/Select data range/i);
    expect(container).toHaveTextContent(/Select metrics to download/i);
  });

  it('calls onDismiss when user clicks on "Cancel" button', async () => {
    const onDismiss = jest.fn();
    renderModal(
      <ExportAnalyticsModal {...defaultProps} onDismiss={onDismiss} />,
    );

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onDismiss).toHaveBeenCalled();
  });

  it('calls onDismiss when user clicks on "Close" button', async () => {
    const onDismiss = jest.fn();
    renderModal(
      <ExportAnalyticsModal {...defaultProps} onDismiss={onDismiss} />,
    );

    await userEvent.click(screen.getByTitle(/close/i));

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

    await userEvent.click(screen.getByText(/Choose a data range/i));
    await userEvent.click(screen.getByText(/This year/i));

    await userEvent.click(
      screen.getByRole('checkbox', { name: /Team Productivity/i }),
    );

    const exportButton = screen.getByRole('button', { name: /Download XLSX/i });
    await userEvent.click(exportButton);
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

    const exportButton = screen.getByRole('button', { name: /Download XLSX/i });
    expect(exportButton).toBeDisabled();

    await userEvent.click(screen.getByText(/Choose a data range/i));
    await userEvent.click(screen.getByText(/Last 12 months/i));
    expect(exportButton).toBeDisabled();

    await userEvent.click(
      screen.getByRole('checkbox', { name: /Team Productivity/i }),
    );

    expect(exportButton).toBeEnabled();
  });

  it('unselects metric option if user clicks on it twice', async () => {
    const onDownload = jest.fn();
    renderModal(
      <ExportAnalyticsModal {...defaultProps} onDownload={onDownload} />,
    );
    const exportButton = screen.getByRole('button', { name: /Download XLSX/i });

    await userEvent.click(screen.getByText(/Choose a data range/i));
    await userEvent.click(screen.getByText(/This year/i));
    expect(exportButton).toBeDisabled();

    await userEvent.click(
      screen.getByRole('checkbox', { name: /Team Productivity/i }),
    );
    expect(exportButton).toBeEnabled();

    await userEvent.click(
      screen.getByRole('checkbox', { name: /Team Productivity/i }),
    );
    expect(exportButton).toBeDisabled();
  });

  it('calls onDownload with selected options', async () => {
    const onDownload = jest.fn();
    renderModal(
      <ExportAnalyticsModal {...defaultProps} onDownload={onDownload} />,
    );

    await userEvent.click(screen.getByText(/Choose a data range/i));
    await userEvent.click(screen.getByText(/Since Hub Launch/i));

    await userEvent.click(
      screen.getByRole('checkbox', { name: /Team Productivity/i }),
    );

    await userEvent.click(
      screen.getByRole('checkbox', {
        name: /Team Co-Production: Within Team/i,
      }),
    );

    await userEvent.click(
      screen.getByRole('checkbox', { name: /Interest Groups/i }),
    );

    await userEvent.click(
      screen.getByRole('checkbox', { name: /Speaker Diversity/i }),
    );

    const exportButton = screen.getByRole('button', { name: /Download XLSX/i });
    await userEvent.click(exportButton);
    await waitFor(() => {
      expect(onDownload).toHaveBeenCalledWith(
        'all',
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
    let resolveDownload: () => void;
    const downloadPromise = new Promise<void>((resolve) => {
      resolveDownload = resolve;
    });
    const onDownload = jest.fn(() => downloadPromise);
    renderModal(
      <ExportAnalyticsModal {...defaultProps} onDownload={onDownload} />,
    );

    await userEvent.click(screen.getByText(/Choose a data range/i));
    await userEvent.click(screen.getByText(/Since Hub Launch/i));

    await userEvent.click(
      screen.getByRole('checkbox', { name: /Team Productivity/i }),
    );
    const exportButton = screen.getByRole('button', { name: /Download XLSX/i });

    // Start the click but don't await it - we want to check state while downloading
    const clickPromise = userEvent.click(exportButton);

    await waitFor(() => {
      expect(exportButton).toHaveTextContent('Exporting...');
    });
    expect(exportButton).toBeDisabled();

    expect(screen.getByLabelText(/time range/i)).toBeDisabled();
    expect(
      screen.getByRole('checkbox', { name: /User Productivity/i }),
    ).toBeDisabled();

    // Now resolve the download promise to let the export complete
    resolveDownload!();
    await clickPromise;

    await waitFor(() => {
      expect(onDownload).toHaveBeenCalled();
    });
  });

  describe('optionsToExport visibility', () => {
    describe.each([
      ['Last 30 days', /^Last 30 days$/i],
      ['Last 90 days', /^Last 90 days$/i],
      ['This year', /^This year \(Jan-Today\)$/i],
    ])(
      'when time range is "%s" (alwaysVisible)',
      (timeRangeName, timeRangePattern) => {
        beforeEach(async () => {
          renderModal(<ExportAnalyticsModal {...defaultProps} />);
          await userEvent.click(screen.getByText(/Choose a data range/i));
          await userEvent.click(screen.getByText(timeRangePattern));
        });

        it('shows RESOURCE & DATA SHARING section with basic options', () => {
          expect(
            screen.getByText('RESOURCE & DATA SHARING'),
          ).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', { name: /User Productivity/i }),
          ).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', { name: /Team Productivity/i }),
          ).toBeInTheDocument();
        });

        it('shows COLLABORATION section with basic options', () => {
          expect(screen.getByText('COLLABORATION')).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', {
              name: /User Co-Production: Within Team/i,
            }),
          ).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', {
              name: /User Co-Production: Across Teams/i,
            }),
          ).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', {
              name: /Team Co-Production: Within Team/i,
            }),
          ).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', {
              name: /Team Co-Production: Across Teams/i,
            }),
          ).toBeInTheDocument();
        });

        it('does not show Share Preliminary Findings option', () => {
          expect(
            screen.queryByRole('checkbox', {
              name: /Share Preliminary Findings/i,
            }),
          ).not.toBeInTheDocument();
        });

        it('does not show LEADERSHIP & MEMBERSHIP section', () => {
          expect(
            screen.queryByText('LEADERSHIP & MEMBERSHIP'),
          ).not.toBeInTheDocument();
          expect(
            screen.queryByRole('checkbox', { name: /Working Groups/i }),
          ).not.toBeInTheDocument();
          expect(
            screen.queryByRole('checkbox', { name: /Interest Groups/i }),
          ).not.toBeInTheDocument();
          expect(
            screen.queryByRole('checkbox', {
              name: /Open Science Championship/i,
            }),
          ).not.toBeInTheDocument();
        });

        it('shows ENGAGEMENT section with Speaker Diversity only', () => {
          expect(screen.getByText('ENGAGEMENT')).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', { name: /Speaker Diversity/i }),
          ).toBeInTheDocument();
        });

        it('does not show Meeting Rep Attendance option', () => {
          expect(
            screen.queryByRole('checkbox', { name: /Meeting Rep Attendance/i }),
          ).not.toBeInTheDocument();
        });

        it('does not show OPEN SCIENCE section', () => {
          expect(screen.queryByText('OPEN SCIENCE')).not.toBeInTheDocument();
          expect(
            screen.queryByRole('checkbox', { name: /Preprint Compliance/i }),
          ).not.toBeInTheDocument();
          expect(
            screen.queryByRole('checkbox', { name: /Publication Compliance/i }),
          ).not.toBeInTheDocument();
        });
      },
    );

    describe('when time range is "Last 12 months"', () => {
      describe('without ANALYTICS_PHASE_TWO feature flag', () => {
        beforeEach(async () => {
          mockUseFlags.mockReturnValue({
            isEnabled: jest.fn().mockReturnValue(false),
            enable: jest.fn(),
            disable: jest.fn(),
            reset: jest.fn(),
            setCurrentOverrides: jest.fn(),
            setEnvironment: jest.fn(),
          });
          renderModal(<ExportAnalyticsModal {...defaultProps} />);
          await userEvent.click(screen.getByText(/Choose a data range/i));
          await userEvent.click(screen.getByText(/Last 12 months/i));
        });

        it('shows RESOURCE & DATA SHARING section with all options', () => {
          expect(
            screen.getByText('RESOURCE & DATA SHARING'),
          ).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', { name: /User Productivity/i }),
          ).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', { name: /Team Productivity/i }),
          ).toBeInTheDocument();
        });

        it('does not show Share Preliminary Findings option', () => {
          expect(screen.getByText('COLLABORATION')).toBeInTheDocument();
          expect(
            screen.queryByRole('checkbox', {
              name: /Share Preliminary Findings/i,
            }),
          ).not.toBeInTheDocument();
        });

        it('does not show LEADERSHIP & MEMBERSHIP section', () => {
          expect(
            screen.queryByText('LEADERSHIP & MEMBERSHIP'),
          ).not.toBeInTheDocument();
        });

        it('shows ENGAGEMENT section without Meeting Rep Attendance', () => {
          expect(screen.getByText('ENGAGEMENT')).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', { name: /Speaker Diversity/i }),
          ).toBeInTheDocument();
          expect(
            screen.queryByRole('checkbox', { name: /Meeting Rep Attendance/i }),
          ).not.toBeInTheDocument();
        });

        it('does not show OPEN SCIENCE section', () => {
          expect(screen.queryByText('OPEN SCIENCE')).not.toBeInTheDocument();
          expect(
            screen.queryByRole('checkbox', { name: /Preprint Compliance/i }),
          ).not.toBeInTheDocument();
          expect(
            screen.queryByRole('checkbox', { name: /Publication Compliance/i }),
          ).not.toBeInTheDocument();
        });
      });

      describe('with ANALYTICS_PHASE_TWO feature flag', () => {
        beforeEach(async () => {
          mockUseFlags.mockReturnValue({
            isEnabled: jest.fn().mockReturnValue(true),
            enable: jest.fn(),
            disable: jest.fn(),
            reset: jest.fn(),
            setCurrentOverrides: jest.fn(),
            setEnvironment: jest.fn(),
          });
          renderModal(<ExportAnalyticsModal {...defaultProps} />);
          await userEvent.click(screen.getByText(/Choose a data range/i));
          await userEvent.click(screen.getByText(/Last 12 months/i));
        });

        it('shows RESOURCE & DATA SHARING section with all options', () => {
          expect(
            screen.getByText('RESOURCE & DATA SHARING'),
          ).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', { name: /User Productivity/i }),
          ).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', { name: /Team Productivity/i }),
          ).toBeInTheDocument();
        });

        it('shows COLLABORATION section with Share Preliminary Findings', () => {
          expect(screen.getByText('COLLABORATION')).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', {
              name: /Share Preliminary Findings/i,
            }),
          ).toBeInTheDocument();
        });

        it('does not show LEADERSHIP & MEMBERSHIP section', () => {
          expect(
            screen.queryByText('LEADERSHIP & MEMBERSHIP'),
          ).not.toBeInTheDocument();
        });

        it('shows ENGAGEMENT section with Meeting Rep Attendance', () => {
          expect(screen.getByText('ENGAGEMENT')).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', { name: /Speaker Diversity/i }),
          ).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', { name: /Meeting Rep Attendance/i }),
          ).toBeInTheDocument();
        });

        it('shows OPEN SCIENCE section with compliance options', () => {
          expect(screen.getByText('OPEN SCIENCE')).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', { name: /Preprint Compliance/i }),
          ).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', { name: /Publication Compliance/i }),
          ).toBeInTheDocument();
        });
      });
    });

    describe('when time range is "Since Hub Launch"', () => {
      describe('without ANALYTICS_PHASE_TWO feature flag', () => {
        beforeEach(async () => {
          mockUseFlags.mockReturnValue({
            isEnabled: jest.fn().mockReturnValue(false),
            enable: jest.fn(),
            disable: jest.fn(),
            reset: jest.fn(),
            setCurrentOverrides: jest.fn(),
            setEnvironment: jest.fn(),
          });
          renderModal(<ExportAnalyticsModal {...defaultProps} />);
          await userEvent.click(screen.getByText(/Choose a data range/i));
          await userEvent.click(screen.getByText(/Since Hub Launch/i));
        });

        it('shows some sections but not OPEN SCIENCE', () => {
          expect(
            screen.getByText('RESOURCE & DATA SHARING'),
          ).toBeInTheDocument();
          expect(screen.getByText('COLLABORATION')).toBeInTheDocument();
          expect(
            screen.getByText('LEADERSHIP & MEMBERSHIP'),
          ).toBeInTheDocument();
          expect(screen.getByText('ENGAGEMENT')).toBeInTheDocument();
          expect(screen.queryByText('OPEN SCIENCE')).not.toBeInTheDocument();
        });

        it('shows LEADERSHIP & MEMBERSHIP with info text', () => {
          expect(
            screen.getByText(
              'Leadership & Membership metrics can only be exported with their current status.',
            ),
          ).toBeInTheDocument();
        });

        it('shows basic LEADERSHIP & MEMBERSHIP options without Open Science Championship', () => {
          expect(
            screen.getByRole('checkbox', { name: /Working Groups/i }),
          ).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', { name: /Interest Groups/i }),
          ).toBeInTheDocument();
          expect(
            screen.queryByRole('checkbox', {
              name: /Open Science Championship/i,
            }),
          ).not.toBeInTheDocument();
        });

        it('does not show Preliminary Data Sharing option', () => {
          expect(
            screen.queryByRole('checkbox', {
              name: /Share Preliminary Findings/i,
            }),
          ).not.toBeInTheDocument();
        });

        it('shows ENGAGEMENT section without Meeting Rep Attendance', () => {
          expect(
            screen.getByRole('checkbox', { name: /Speaker Diversity/i }),
          ).toBeInTheDocument();
          expect(
            screen.queryByRole('checkbox', { name: /Meeting Rep Attendance/i }),
          ).not.toBeInTheDocument();
        });

        it('does not show OPEN SCIENCE options', () => {
          expect(
            screen.queryByRole('checkbox', { name: /Preprint Compliance/i }),
          ).not.toBeInTheDocument();
          expect(
            screen.queryByRole('checkbox', { name: /Publication Compliance/i }),
          ).not.toBeInTheDocument();
        });
      });

      describe('with ANALYTICS_PHASE_TWO feature flag', () => {
        beforeEach(async () => {
          mockUseFlags.mockReturnValue({
            isEnabled: jest.fn().mockReturnValue(true),
            enable: jest.fn(),
            disable: jest.fn(),
            reset: jest.fn(),
            setCurrentOverrides: jest.fn(),
            setEnvironment: jest.fn(),
          });
          renderModal(<ExportAnalyticsModal {...defaultProps} />);
          await userEvent.click(screen.getByText(/Choose a data range/i));
          await userEvent.click(screen.getByText(/Since Hub Launch/i));
        });

        it('shows all sections including LEADERSHIP & MEMBERSHIP', () => {
          expect(
            screen.getByText('RESOURCE & DATA SHARING'),
          ).toBeInTheDocument();
          expect(screen.getByText('COLLABORATION')).toBeInTheDocument();
          expect(
            screen.getByText('LEADERSHIP & MEMBERSHIP'),
          ).toBeInTheDocument();
          expect(screen.getByText('ENGAGEMENT')).toBeInTheDocument();
          expect(screen.getByText('OPEN SCIENCE')).toBeInTheDocument();
        });

        it('shows LEADERSHIP & MEMBERSHIP with info text', () => {
          expect(
            screen.getByText(
              'Leadership & Membership metrics can only be exported with their current status.',
            ),
          ).toBeInTheDocument();
        });

        it('shows all LEADERSHIP & MEMBERSHIP options', () => {
          expect(
            screen.getByRole('checkbox', { name: /Working Groups/i }),
          ).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', { name: /Interest Groups/i }),
          ).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', {
              name: /Open Science Championship/i,
            }),
          ).toBeInTheDocument();
        });

        it('shows Preliminary Data Sharing option', () => {
          expect(
            screen.getByRole('checkbox', {
              name: /Share Preliminary Findings/i,
            }),
          ).toBeInTheDocument();
        });

        it('shows all ENGAGEMENT options', () => {
          expect(
            screen.getByRole('checkbox', { name: /Speaker Diversity/i }),
          ).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', { name: /Meeting Rep Attendance/i }),
          ).toBeInTheDocument();
        });

        it('shows all OPEN SCIENCE options', () => {
          expect(
            screen.getByRole('checkbox', { name: /Preprint Compliance/i }),
          ).toBeInTheDocument();
          expect(
            screen.getByRole('checkbox', { name: /Publication Compliance/i }),
          ).toBeInTheDocument();
        });
      });
    });

    describe('when no time range is selected', () => {
      it('shows all sections and options by default with feature flag enabled', () => {
        mockUseFlags.mockReturnValue({
          isEnabled: jest.fn().mockReturnValue(true),
          enable: jest.fn(),
          disable: jest.fn(),
          reset: jest.fn(),
          setCurrentOverrides: jest.fn(),
          setEnvironment: jest.fn(),
        });
        renderModal(<ExportAnalyticsModal {...defaultProps} />);

        expect(screen.getByText('RESOURCE & DATA SHARING')).toBeInTheDocument();
        expect(screen.getByText('COLLABORATION')).toBeInTheDocument();
        expect(screen.getByText('LEADERSHIP & MEMBERSHIP')).toBeInTheDocument();
        expect(screen.getByText('ENGAGEMENT')).toBeInTheDocument();
        expect(screen.getByText('OPEN SCIENCE')).toBeInTheDocument();
      });

      it('disables all checkbox options until time range is selected', () => {
        mockUseFlags.mockReturnValue({
          isEnabled: jest.fn().mockReturnValue(true),
          enable: jest.fn(),
          disable: jest.fn(),
          reset: jest.fn(),
          setCurrentOverrides: jest.fn(),
          setEnvironment: jest.fn(),
        });
        renderModal(<ExportAnalyticsModal {...defaultProps} />);

        expect(
          screen.getByRole('checkbox', { name: /User Productivity/i }),
        ).toBeDisabled();
        expect(
          screen.getByRole('checkbox', { name: /Team Productivity/i }),
        ).toBeDisabled();
        expect(
          screen.getByRole('checkbox', { name: /Open Science Championship/i }),
        ).toBeDisabled();
      });
    });
  });
});
