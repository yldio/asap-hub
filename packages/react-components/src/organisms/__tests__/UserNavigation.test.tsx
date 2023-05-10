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
