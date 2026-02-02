import { EngagementType } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import AnalyticsEngagementPageBody from '../AnalyticsEngagementPageBody';

describe('AnalyticsEngagementPageBody', () => {
  const props: ComponentProps<typeof AnalyticsEngagementPageBody> = {
    children: <span>table</span>,
    currentPage: 2,
    metric: 'presenters',
    setMetric: () => null,
    exportResults: () => Promise.resolve(),
    setTags: jest.fn(),
    tags: [],
    loadTags: jest.fn().mockResolvedValue([]),
    timeRange: '30d',
  };

  it.each([
    { metric: 'presenters', title: 'Representation of Presenters' },
    { metric: 'attendance', title: 'Meeting Rep Attendance' },
  ])('renders the page title when metric is $metric', ({ metric, title }) => {
    const { getByRole } = render(
      <AnalyticsEngagementPageBody
        {...props}
        metric={metric as EngagementType}
      />,
    );

    expect(getByRole('heading', { name: title })).toBeInTheDocument();
  });

  it.each([
    {
      metric: 'presenters',
      text: 'Number of presentations conducted by each team, along with an overview of which type of presenters were represented.',
    },
    {
      metric: 'attendance',
      text: 'Percentage of team representatives attending interest group meetings.',
    },
  ])('renders the page description for $metric', ({ metric, text }) => {
    const { getByText } = render(
      <AnalyticsEngagementPageBody
        {...props}
        metric={metric as EngagementType}
      />,
    );

    expect(getByText(text)).toBeInTheDocument();
  });

  it('displays attendance option', async () => {
    render(<AnalyticsEngagementPageBody {...props} />);

    const dropdowns = screen.getAllByRole('combobox', { hidden: false });
    await userEvent.click(dropdowns[0] as Element);
    expect(screen.getByText('Meeting Rep Attendance')).toBeInTheDocument();
  });
});
