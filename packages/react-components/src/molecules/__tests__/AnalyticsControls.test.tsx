import { render } from '@testing-library/react';
import { ComponentProps } from 'react';

import AnalyticsControls from '../AnalyticsControls';

describe('AnalyticsControls', () => {
  const defaultProps: ComponentProps<typeof AnalyticsControls> = {
    currentPage: 0,
    tags: [],
    setTags: jest.fn(),
    loadTags: jest.fn().mockResolvedValue([]),
  };

  it('renders range selection dropdown if time range provided', () => {
    const { container, queryByRole, getByRole, rerender } = render(
      <AnalyticsControls {...defaultProps} />,
    );
    expect(queryByRole('button', { name: /chevron down/i })).toBeNull();

    rerender(<AnalyticsControls {...defaultProps} timeRange={'30d'} />);
    expect(getByRole('button', { name: /chevron down/i })).toBeVisible();
    expect(container).toHaveTextContent('Last 30 days');
  });

  it('renders search box if metricOption is provided', () => {
    const { getByRole, queryByRole, rerender } = render(
      <AnalyticsControls {...defaultProps} />,
    );

    expect(queryByRole('search')).toBeNull();

    rerender(<AnalyticsControls {...defaultProps} metricOption={'user'} />);
    expect(getByRole('search')).toBeVisible();
  });

  it('renders export csv button if exportResults is provided', () => {
    const { rerender, queryByText, getByText } = render(
      <AnalyticsControls {...defaultProps} />,
    );
    expect(queryByText(/export as:/i)).toBeNull();
    const mockExport = jest.fn(() => Promise.resolve());
    rerender(
      <AnalyticsControls {...defaultProps} exportResults={mockExport} />,
    );
    expect(getByText(/export as:/i)).toBeVisible();
  });
});
