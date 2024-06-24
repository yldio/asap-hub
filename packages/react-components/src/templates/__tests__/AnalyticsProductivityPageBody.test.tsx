import { render, screen, waitFor } from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { AnalyticsProductivityPageBody } from '..';

describe('AnalyticsProductivityPageBody', () => {
  const props: ComponentProps<typeof AnalyticsProductivityPageBody> = {
    setMetric: () => null,
    type: 'all',
    setType: jest.fn(),
    exportResults: () => Promise.resolve(),
    metric: 'user',
    timeRange: '30d',
    tags: [],
    setTags: jest.fn(),
    loadTags: jest.fn().mockResolvedValue([]),
    currentPage: 5,
    children: <span>table</span>,
  };
  it('renders user tab', () => {
    const { container } = render(
      <AnalyticsProductivityPageBody {...props} metric="user" />,
    );

    expect(container).toHaveTextContent(
      'Overview of ASAP outputs shared on the CRN Hub by user',
    );
  });

  it('renders team tab', () => {
    const { container } = render(
      <AnalyticsProductivityPageBody {...props} metric="team" />,
    );

    expect(container).toHaveTextContent(
      'Overview of ASAP outputs shared on the CRN Hub by team',
    );
  });

  it('renders type selection for team tab', () => {
    const { container } = render(
      <AnalyticsProductivityPageBody {...props} metric="team" />,
    );

    expect(container).toHaveTextContent('Type:');
  });

  it('calls the setType function when the type is changed', async () => {
    render(
      <AnalyticsProductivityPageBody {...props} metric="team" type="all" />,
    );

    const typeDropdown = screen.getByLabelText('type');
    userEvent.type(typeDropdown, 'ASAP Public');
    userEvent.type(typeDropdown, specialChars.enter);
    typeDropdown.blur();

    await waitFor(() => {
      expect(props.setType).toHaveBeenCalledWith('public');
    });
  });
});
