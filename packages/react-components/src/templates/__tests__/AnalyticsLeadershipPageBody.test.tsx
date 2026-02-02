import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { AnalyticsLeadershipPageBody } from '..';

describe('AnalyticsLeadershipPageBody', () => {
  const props: ComponentProps<typeof AnalyticsLeadershipPageBody> = {
    setMetric: () => {},
    exportResults: () => Promise.resolve(),
    metric: 'interest-group',
    setTags: jest.fn(),
    tags: [],
    children: <></>,
  };

  it('renders interest group tab', () => {
    const { getAllByText } = render(
      <AnalyticsLeadershipPageBody {...props} metric="interest-group" />,
    );

    expect(getAllByText('Interest Group Leadership & Membership').length).toBe(
      2,
    );
  });

  it('renders working group tab', () => {
    const { getAllByText } = render(
      <AnalyticsLeadershipPageBody {...props} metric="working-group" />,
    );

    expect(getAllByText('Working Group Leadership & Membership').length).toBe(
      2,
    );
  });

  it('renders OS champion tab', () => {
    const { getAllByText } = render(
      <AnalyticsLeadershipPageBody {...props} metric="os-champion" />,
    );

    expect(getAllByText('Open Science Champion').length).toBe(2);
  });

  it('displays OS champion option in dropdown', async () => {
    render(<AnalyticsLeadershipPageBody {...props} metric="working-group" />);

    const dropdowns = screen.getAllByRole('combobox', { hidden: false });
    await userEvent.click(dropdowns[0] as Element);
    await waitFor(() => {
      expect(screen.getByText('Open Science Champion')).toBeInTheDocument();
    });
  });
});
