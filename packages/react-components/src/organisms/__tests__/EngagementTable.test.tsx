import { EngagementResponse } from '@asap-hub/model';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import EngagementTable from '../EngagementTable';

describe('EngagementTable', () => {
  const pageControlsProps = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
  };

  const defaultProps: ComponentProps<typeof EngagementTable> = {
    ...pageControlsProps,
    data: [],
  };

  const engagementData: EngagementResponse = {
    id: '1',
    name: 'Test Team',
    inactiveSince: null,
    memberCount: 1,
    eventCount: 2,
    totalSpeakerCount: 3,
    uniqueAllRolesCount: 3,
    uniqueKeyPersonnelCount: 2,
  };

  it('renders data', () => {
    const data = [engagementData];
    const { getByText } = render(
      <EngagementTable {...defaultProps} data={data} />,
    );
    expect(getByText('Test Team')).toBeInTheDocument();
  });

  it('renders inactive badge', () => {
    const data = [
      {
        ...engagementData,
        isInactive: true,
      },
    ];
    const { getByTitle } = render(
      <EngagementTable {...defaultProps} data={data} />,
    );
    expect(getByTitle('Inactive Team')).toBeInTheDocument();
  });
});
