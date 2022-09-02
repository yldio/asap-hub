import { render, screen } from '@testing-library/react';
import WorkingGroupOverview from '../WorkingGroupOverview';

it('renders the members list', () => {
  render(
    <WorkingGroupOverview
      members={[
        {
          userId: 'uuid',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Lead',
        },
      ]}
    >
      Body
    </WorkingGroupOverview>,
  );

  expect(screen.getByText('Working Group Members (1)')).toBeInTheDocument();
  const avatar = screen.getByText(/john doe/i);
  expect(avatar).toBeVisible();
  expect(avatar.closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/uuid/i),
  );
  expect(screen.getByText('Lead')).toBeInTheDocument();
});

it('does not render the list if there are no members', () => {
  render(<WorkingGroupOverview members={[]}>Body</WorkingGroupOverview>);
  expect(screen.queryByText(/Working Group Members/i)).not.toBeInTheDocument();
});
