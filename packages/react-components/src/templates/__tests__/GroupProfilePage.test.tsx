import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { createGroupResponse } from '@asap-hub/fixtures';

import GroupProfilePage from '../GroupProfilePage';

const props: ComponentProps<typeof GroupProfilePage> = {
  ...createGroupResponse(),
  groupTeamsHref: '#teams',
  lastModifiedDate: '2021-01-01',
  numberOfTeams: 1,
  pastEventsCount: 0,
  upcomingEventsCount: 0,
};

it('renders the header', () => {
  render(<GroupProfilePage {...props} name="My Group" />);
  expect(screen.getByRole('heading')).toContainElement(
    screen.getByText('My Group'),
  );
});

it('renders the children', () => {
  render(<GroupProfilePage {...props}>Page Content</GroupProfilePage>);
  expect(screen.getByText('Page Content')).toBeVisible();
});
