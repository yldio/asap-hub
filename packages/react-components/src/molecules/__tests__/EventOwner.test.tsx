import {
  createGroupResponse,
  createWorkingGroupResponse,
} from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';

import EventOwner from '../EventOwner';

it('renders the interest group name linking to the group and icon', () => {
  render(
    <EventOwner
      group={{
        ...createGroupResponse(),
        id: 'grp',
        name: 'My Group',
      }}
    />,
  );
  expect(screen.getByText('My Group')).toHaveAttribute(
    'href',
    expect.stringMatching(/grp$/),
  );
  expect(screen.getByTitle('Interest Group')).toBeInTheDocument();
});

it('renders the working group name linking to the group and icon', () => {
  render(
    <EventOwner
      workingGroup={{
        ...createWorkingGroupResponse(),
        id: 'grp',
        title: 'My Working Group',
      }}
    />,
  );
  expect(screen.getByText('My Working Group')).toHaveAttribute(
    'href',
    expect.stringMatching(/grp$/),
  );
  expect(screen.getByTitle('Working Groups')).toBeInTheDocument();
});

it('shows that the event is run by ASAP when there is no group', () => {
  render(<EventOwner />);
  expect(screen.getByText(/asap event/i)).not.toHaveAttribute('href');
});

it('displays inactive badge when a group is inactive', () => {
  render(<EventOwner group={{ ...createGroupResponse(), active: false }} />);

  expect(screen.getByTitle('Inactive')).toBeInTheDocument();
});
