import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createGroupResponseItem } from '@asap-hub/fixtures';

import GroupProfilePage from '../GroupProfilePage';

const props: ComponentProps<typeof GroupProfilePage> = {
  ...createGroupResponseItem(),
  aboutHref: '#about',
  calendarHref: '#calendar',
  groupTeamsHref: '#teams',
  lastModifiedDate: '2021-01-01',
  numberOfTeams: 1,
};

it('renders the header', () => {
  const { getByText, getByRole } = render(
    <GroupProfilePage {...props} name="My Group" />,
  );
  expect(getByRole('heading')).toContainElement(getByText('My Group'));
});

it('renders the children', () => {
  const { getByText } = render(
    <GroupProfilePage {...props}>Page Content</GroupProfilePage>,
  );
  expect(getByText('Page Content')).toBeVisible();
});
