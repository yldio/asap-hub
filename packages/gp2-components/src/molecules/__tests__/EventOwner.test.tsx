import { gp2 } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';

import EventOwner from '../EventOwner';

it('renders the interest group name linking to the group and icon', () => {
  render(
    <EventOwner
      project={{
        ...gp2.createProjectResponse(),
        id: 'grp',
        title: 'My Project',
      }}
    />,
  );
  expect(screen.getByText('My Project')).toHaveAttribute(
    'href',
    expect.stringMatching(/grp$/),
  );
  expect(screen.getByTitle('Projects')).toBeInTheDocument();
});

it('renders the working group name linking to the group and icon', () => {
  render(
    <EventOwner
      workingGroup={{
        ...gp2.createWorkingGroupResponse(),
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

it('shows that the event is run by GP2 when there is no project or working group', () => {
  render(<EventOwner />);
  expect(screen.getByText(/gp2 hub/i)).not.toHaveAttribute('href');
});
it('renders the working group name linking to the group and icon if there is a project too', () => {
  render(
    <EventOwner
      workingGroup={{
        ...gp2.createWorkingGroupResponse(),
        id: 'grp',
        title: 'My Working Group',
      }}
      project={{
        ...gp2.createProjectResponse(),
        id: 'grp',
        title: 'My Project',
      }}
    />,
  );
  expect(screen.getByText('My Working Group')).toHaveAttribute(
    'href',
    expect.stringMatching(/grp$/),
  );
  expect(screen.getByTitle('Working Groups')).toBeInTheDocument();
  expect(screen.queryByText('My Project')).not.toBeInTheDocument();
  expect(screen.queryByTitle('Projects')).not.toBeInTheDocument();
});
