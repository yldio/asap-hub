import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { createInterestGroupResponse } from '@asap-hub/fixtures';

import InterestGroupProfilePage from '../InterestGroupProfilePage';

const props: ComponentProps<typeof InterestGroupProfilePage> = {
  ...createInterestGroupResponse(),
  groupTeamsHref: '#teams',
  lastModifiedDate: '2021-01-01',
  numberOfTeams: 1,
  pastEventsCount: 0,
  upcomingEventsCount: 0,
  active: true,
};

it('renders the header', () => {
  render(<InterestGroupProfilePage {...props} name="My Group" />);
  expect(screen.getByRole('heading')).toContainElement(
    screen.getByText('My Group'),
  );
});

it('renders the children', () => {
  render(
    <InterestGroupProfilePage {...props}>
      Page Content
    </InterestGroupProfilePage>,
  );
  expect(screen.getByText('Page Content')).toBeVisible();
});

it('renders the inactive group header for inactive group', () => {
  render(
    <InterestGroupProfilePage {...props} name="My Group" active={false} />,
  );
  expect(
    screen.getByText(
      'This group is inactive and might not have all content available.',
    ),
  ).toBeVisible();
  expect(screen.getByTitle('Warning')).toBeInTheDocument();
});

it('does not render the inactive group header for active group', () => {
  render(<InterestGroupProfilePage {...props} name="My Group" active={true} />);
  expect(
    screen.queryByText(
      'This group is inactive and might not have all content available.',
    ),
  ).not.toBeInTheDocument();
});
