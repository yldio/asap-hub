import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { AnalyticsOpenSciencePageBody } from '..';

describe('AnalyticsOpenSciencePageBody', () => {
  const props: ComponentProps<typeof AnalyticsOpenSciencePageBody> = {
    children: <span data-testid="children">table content</span>,
    exportResults: jest.fn(() => Promise.resolve()),
    loadTags: jest.fn().mockResolvedValue([]),
    metric: 'preprint-compliance',
    setMetric: jest.fn(),
    setTags: jest.fn(),
    tags: ['test-tag'],
    timeRange: 'all',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders preprint compliance tab', () => {
    render(
      <AnalyticsOpenSciencePageBody {...props} metric="preprint-compliance" />,
    );

    expect(
      screen.getByRole('heading', { name: 'Preprint Compliance' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Number of preprints posted to a preprint repository/),
    ).toBeInTheDocument();
  });

  it('renders preprint compliance tab when no metric is provided', () => {
    render(<AnalyticsOpenSciencePageBody {...props} />);

    expect(
      screen.getByRole('heading', { name: 'Preprint Compliance' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Number of preprints posted to a preprint repository/),
    ).toBeInTheDocument();
  });

  it('renders publication compliance tab', () => {
    render(
      <AnalyticsOpenSciencePageBody
        {...props}
        metric="publication-compliance"
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Publication Compliance' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Percent compliance by research output type/),
    ).toBeInTheDocument();
  });

  it('renders metric dropdown with correct options', async () => {
    render(<AnalyticsOpenSciencePageBody {...props} />);

    const dropdown = screen.getByDisplayValue('preprint-compliance');
    expect(dropdown).toBeInTheDocument();

    const dropdownIndicators = screen.getAllByTitle('Chevron Down');
    await userEvent.click(dropdownIndicators[0]!);

    await waitFor(() => {
      expect(screen.getAllByText('Preprint Compliance')).toHaveLength(3);
      expect(screen.getAllByText('Publication Compliance')).toHaveLength(1);
    });
  });

  it('calls setMetric when dropdown value changes', async () => {
    const mockSetMetric = jest.fn();
    render(
      <AnalyticsOpenSciencePageBody {...props} setMetric={mockSetMetric} />,
    );

    const dropdown = screen.getByDisplayValue('preprint-compliance');
    expect(dropdown).toBeInTheDocument();

    expect(mockSetMetric).not.toHaveBeenCalled();

    const dropdownIndicators = screen.getAllByTitle('Chevron Down');
    userEvent.click(dropdownIndicators[0]!);

    await waitFor(() => {
      expect(screen.getByText('Publication Compliance')).toBeInTheDocument();
    });

    const publicationOption = screen.getByText('Publication Compliance');
    userEvent.click(publicationOption);

    expect(mockSetMetric).toHaveBeenCalledWith('publication-compliance');
  });

  it('renders children content', () => {
    render(<AnalyticsOpenSciencePageBody {...props} />);

    expect(screen.getByTestId('children')).toBeInTheDocument();
    expect(screen.getByText('table content')).toBeInTheDocument();
  });

  it('handles empty tags array', () => {
    render(<AnalyticsOpenSciencePageBody {...props} tags={[]} />);

    expect(
      screen.getByRole('heading', { name: 'Preprint Compliance' }),
    ).toBeInTheDocument();
  });

  it('handles multiple tags', () => {
    render(
      <AnalyticsOpenSciencePageBody
        {...props}
        tags={['tag1', 'tag2', 'tag3']}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Preprint Compliance' }),
    ).toBeInTheDocument();
  });

  it('uses noop function when loadTags is not provided', () => {
    const propsWithoutLoadTags = { ...props };
    delete propsWithoutLoadTags.loadTags;

    render(<AnalyticsOpenSciencePageBody {...propsWithoutLoadTags} />);

    expect(
      screen.getByRole('heading', { name: 'Preprint Compliance' }),
    ).toBeInTheDocument();
  });

  it('renders with different time ranges', () => {
    render(<AnalyticsOpenSciencePageBody {...props} timeRange="30d" />);

    expect(
      screen.getByRole('heading', { name: 'Preprint Compliance' }),
    ).toBeInTheDocument();
  });

  it('renders with all time range', () => {
    render(<AnalyticsOpenSciencePageBody {...props} timeRange="all" />);

    expect(
      screen.getByRole('heading', { name: 'Preprint Compliance' }),
    ).toBeInTheDocument();
  });

  it('renders with year time range', () => {
    render(
      <AnalyticsOpenSciencePageBody {...props} timeRange="current-year" />,
    );

    expect(
      screen.getByRole('heading', { name: 'Preprint Compliance' }),
    ).toBeInTheDocument();
  });

  it('calls exportResults when export is triggered', async () => {
    const mockExportResults = jest.fn(() => Promise.resolve());
    render(
      <AnalyticsOpenSciencePageBody
        {...props}
        exportResults={mockExportResults}
      />,
    );

    userEvent.click(screen.getByRole('button', { name: /CSV/i }));
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Preprint Compliance' }),
      ).toBeInTheDocument();
      expect(mockExportResults).toHaveBeenCalled();
    });
  });

  describe('metric descriptions', () => {
    it('shows correct description for preprint compliance', () => {
      render(
        <AnalyticsOpenSciencePageBody
          {...props}
          metric="preprint-compliance"
        />,
      );

      expect(
        screen.getByText(
          /Number of preprints posted to a preprint repository and percentage posted prior to journal submission by each team/,
        ),
      ).toBeInTheDocument();
    });

    it('shows correct description for publication compliance', () => {
      render(
        <AnalyticsOpenSciencePageBody
          {...props}
          metric="publication-compliance"
        />,
      );

      expect(
        screen.getByText(
          /Percent compliance by research output type for each team/,
        ),
      ).toBeInTheDocument();
    });
  });
});
