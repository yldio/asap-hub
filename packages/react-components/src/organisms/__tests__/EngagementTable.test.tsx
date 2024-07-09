import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import EngagementTable, { EngagementData } from '../EngagementTable';

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

  const engagementData: EngagementData = {
    id: '1',
    name: 'Test Team',
    isInactive: false,
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
