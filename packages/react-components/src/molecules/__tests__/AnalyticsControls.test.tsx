import { render } from '@testing-library/react';
import { ComponentProps } from 'react';

import AnalyticsControls from '../AnalyticsControls';
import { getLocalTimezone } from '../../localization';

jest.mock('../../localization');
const mockGetLocalTimezone = getLocalTimezone as jest.MockedFunction<
  typeof getLocalTimezone
>;

describe('AnalyticsControls', () => {
  const defaultProps: ComponentProps<typeof AnalyticsControls> = {
    currentPage: 0,
    tags: [],
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

  it('conditionally renders document category selector', () => {
    const { getByRole, getByText, queryByRole, queryByText, rerender } = render(
      <AnalyticsControls {...defaultProps} />,
    );

    expect(queryByRole('button', { name: /all chevron down/i })).toBeNull();
    expect(queryByText(/document category:/i)).not.toBeInTheDocument();

    rerender(
      <AnalyticsControls
        {...defaultProps}
        metricOption={'user'}
        documentCategory="all"
      />,
    );

    expect(getByRole('button', { name: /all chevron down/i })).toBeVisible();
    expect(getByText(/document category:/i)).toBeVisible();
  });

  it('conditionally renders output type selector', () => {
    const { getByRole, getByText, queryByRole, queryByText, rerender } = render(
      <AnalyticsControls {...defaultProps} />,
    );

    expect(queryByRole('button', { name: /output chevron down/i })).toBeNull();
    expect(queryByText(/type:/i)).not.toBeInTheDocument();

    rerender(
      <AnalyticsControls
        {...defaultProps}
        metricOption={'team'}
        outputType="all"
      />,
    );

    expect(getByRole('button', { name: /output chevron down/i })).toBeVisible();
    expect(getByText(/type:/i)).toBeVisible();
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

  it('maintains tag search when changing time range', () => {
    delete (window as Partial<Window>).location;
    window.location = { search: '?range=30d&tag=TestTag' } as Location;

    const { getByText } = render(
      <AnalyticsControls {...defaultProps} timeRange={'30d'} />,
    );
    expect(getByText('Last 90 days').closest('a')!.href).toContain(
      'tag=TestTag',
    );
  });

  describe('getLastUpdate', () => {
    const zone = 'Europe/Moscow';
    beforeAll(() => {
      jest.useFakeTimers();
      mockGetLocalTimezone.mockReturnValue(zone);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('returns last update in users timezone', () => {
      jest.setSystemTime(new Date('2024-09-01T12:35:00.000+03:00'));

      const { getByText } = render(
        <AnalyticsControls {...defaultProps} timeRange={'30d'} />,
      );
      expect(
        getByText(/1st September 2024, 9:00 am \(GMT\+3\)/i),
      ).toBeInTheDocument();
    });

    it('returns previous days run if not yet 7am UTC', () => {
      jest.setSystemTime(new Date('2024-09-01T09:00:00.000+03:00'));

      const { getByText } = render(
        <AnalyticsControls {...defaultProps} timeRange={'30d'} />,
      );
      expect(
        getByText(/31st August 2024, 9:00 am \(GMT\+3\)/i),
      ).toBeInTheDocument();
    });
  });
});
