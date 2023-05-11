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
  aboutHref: '/about',
};

it.skip('renders the navigation items', () => {
  const { getAllByRole } = render(<UserNavigation {...props} />);
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual([
    expect.stringMatching(/profile/i),
    expect.stringContaining('Team 1'),
    expect.stringContaining('Team 2'),
    expect.stringMatching(/feedback/i),
    expect.stringMatching(/log.*out/i),
  ]);
});

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

it.skip('enables My team link when user is onboarded', () => {
  const { getAllByText, rerender } = render(
    <UserNavigation
      {...props}
      userOnboarded={false}
      teams={[{ name: 'Team 1', href: '/team-1' }]}
    />,
  );
  getAllByText(/^My team:/i).map((groupItem) =>
    expect(groupItem).toHaveStyle('opacity: 0,3'),
  );

  rerender(
    <UserNavigation
      {...props}
      userOnboarded={true}
      teams={[{ name: 'Team 1', href: '/team-1' }]}
    />,
  );
  getAllByText(/^My team:/i).map((groupItem) =>
    expect(groupItem).toHaveStyle('opacity:'),
  );
});
