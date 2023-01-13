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

it('displays the show more message', () => {
  const groups = Array.from(Array(7).keys()).map((index) => ({
    id: `group-${index}`,
    name: 'Active WG',
    role: 'Chair' as unknown as 'Chair',
    active: true,
  }));

  render(<WorkingGroupsTabbedCard {...props} groups={groups} />);

  const showMore = screen.getByText('View More Memberships');
  expect(showMore).toBeInTheDocument();
  fireEvent.click(showMore);

  const showLess = screen.getByText('View Less Memberships');
  expect(showLess).toBeInTheDocument();
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
