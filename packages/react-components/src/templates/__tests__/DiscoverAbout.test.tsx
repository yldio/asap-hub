import { ComponentProps } from 'react';
import { createUserResponse } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';

import DiscoverAbout from '../DiscoverAbout';

const props: ComponentProps<typeof DiscoverAbout> = {
  aboutUs: '',
  members: [],
  scientificAdvisoryBoard: [],
};

it('renders the about page', () => {
  render(<DiscoverAbout {...props} />);
  expect(screen.getByText(/About ASAP/, { selector: 'h2' })).toBeVisible();
});

it('renders about section', () => {
  render(<DiscoverAbout {...props} aboutUs="About us content" />);
  expect(screen.getByText('About us content')).toBeVisible();
});

it('renders members section without link', () => {
  render(
    <DiscoverAbout
      {...props}
      members={[{ ...createUserResponse(), displayName: 'first member' }]}
    />,
  );

  expect(screen.getByText('Meet the ASAP team')).toBeVisible();
  expect(screen.getByText('first member')).toBeVisible();
});
it('renders members section with link', () => {
  render(
    <DiscoverAbout
      {...props}
      members={[{ ...createUserResponse(), displayName: 'first member' }]}
      membersTeamId="member-1"
    />,
  );

  expect(
    screen.getByText('Explore the ASAP team').closest('a'),
  ).toHaveAttribute('href', '/network/teams/member-1');
});
it('renders scientific Advisory Board section', () => {
  render(
    <DiscoverAbout
      {...props}
      scientificAdvisoryBoard={[
        { ...createUserResponse(), displayName: 'first advisor' },
      ]}
    />,
  );

  expect(screen.getByText('Meet the Scientific Advisory Board')).toBeVisible();
  expect(screen.getByText('first advisor')).toBeVisible();
});
