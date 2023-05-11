import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import UserNavigation from '../UserNavigation';

const props: ComponentProps<typeof UserNavigation> = {
  userProfileHref: '/profile',
  teams: [
    { name: 'Team 1', href: '/team-1' },
    { name: 'Team 2', href: '/team-2' },
  ],
  workingGroups: [
    {
      name: 'Working Group 1',
      href: '/working-group-1',
      active: true,
    },
  ],
  interestGroups: [
    {
      name: 'Interest Group 1',
      href: '/interest-group-1',
      active: true,
    },
  ],
  aboutHref: '/about',
};

it('renders the bottom links', () => {
  const { getByText } = render(<UserNavigation {...props} />);
  expect(getByText(/terms/i)).toBeVisible();
  expect(getByText(/privacy/i)).toBeVisible();
  expect(getByText(/about/i)).toBeVisible();
});

it('applies the passed href', () => {
  const { getAllByRole } = render(
    <UserNavigation {...props} userProfileHref="/profile" />,
  );
  expect(
    getAllByRole('link').find(({ textContent }) =>
      /profile/i.test(textContent ?? ''),
    ),
  ).toHaveAttribute('href', '/profile');
});

it('renders the associations sections', () => {
  const { getByText } = render(<UserNavigation {...props} />);
  expect(getByText('MY TEAMS')).toBeVisible();
  expect(getByText(/team 1/i)).toBeVisible();
  expect(getByText(/team 2/i)).toBeVisible();

  expect(getByText('MY INTEREST GROUPS')).toBeVisible();
  expect(getByText(/interest group 1/i)).toBeVisible();

  expect(getByText('MY WORKING GROUPS')).toBeVisible();
  expect(getByText(/working group 1/i)).toBeVisible();
});

it('does not render the associations sections for missing associations', () => {
  const { queryByText } = render(
    <UserNavigation {...props} interestGroups={[]} workingGroups={[]} />,
  );

  expect(queryByText('MY INTEREST GROUPS')).not.toBeInTheDocument();
  expect(queryByText('MY WORKING GROUPS')).not.toBeInTheDocument();
});
