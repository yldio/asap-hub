import { render, fireEvent, screen } from '@testing-library/react';
import { WorkingGroupMembership } from '@asap-hub/model';

import WorkingGroupsTabbedCard from '../WorkingGroupsTabbedCard';

const props = {
  userName: 'Foo B',
  groups: [],
  isUserAlumni: false,
};

it('displays the title', () => {
  render(<WorkingGroupsTabbedCard {...props} userName="Brad B" />);

  expect(screen.getByText("Brad B's Working Groups")).toBeInTheDocument();
});

it('renders the no memberships message', () => {
  const { rerender } = render(
    <WorkingGroupsTabbedCard {...props} isUserAlumni={true} />,
  );
  expect(screen.getByText('There are no past memberships.')).toBeVisible();
  rerender(<WorkingGroupsTabbedCard {...props} isUserAlumni={false} />);
  expect(screen.getByText('There are no active memberships.')).toBeVisible();
});

it('splits the current and complete groups', () => {
  const groups: WorkingGroupMembership[] = [
    { id: 'group-1', name: 'Active WG', role: 'Chair', active: true },
    { id: 'group-2', name: 'Complete WG', role: 'Chair', active: false },
  ];
  render(<WorkingGroupsTabbedCard {...props} groups={groups} />);

  expect(screen.getByText('Active WG')).toBeInTheDocument();
  expect(screen.queryByText('Complete WG')).not.toBeInTheDocument();

  fireEvent.click(screen.getByText('Past Memberships (1)'));

  expect(screen.getByText('Complete WG')).toBeInTheDocument();
  expect(screen.queryByText('Active WG')).not.toBeInTheDocument();
});
