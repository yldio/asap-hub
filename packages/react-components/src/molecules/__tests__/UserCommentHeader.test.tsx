import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import UserCommentHeader from '../UserCommentHeader';

const props: ComponentProps<typeof UserCommentHeader> = {
  userHref: 'http://user',
  displayName: 'John (Joe) Doe',
  firstName: 'John',
  lastName: 'Doe',
  avatarUrl: '/pic.jpg',
  alumniSinceDate: undefined,
  teams: [{ href: 'http://team/a', name: 'Team A' }],
  date: '2023-07-09T03:00:00.000Z',
};

it('renders display name, team and date', () => {
  render(<UserCommentHeader {...props} />);
  expect(screen.getByText('John (Joe) Doe')).toBeVisible();
  expect(screen.getByText('John (Joe) Doe').closest('a')!.href).toContain(
    'http://user',
  );

  expect(screen.getByText('Team A')).toBeVisible();
  expect(screen.getByText('Team A').closest('a')!.href).toContain(
    'http://team/a',
  );

  expect(screen.getByText('9th July 2023')).toBeVisible();
});

it('renders Multiple Teams when user has more than one team', () => {
  render(
    <UserCommentHeader
      {...props}
      teams={[
        { href: 'http://team/a', name: 'Team A' },
        { href: 'http://team/b', name: 'Team B' },
      ]}
    />,
  );
  expect(screen.getByText('Multiple teams')).toBeVisible();
  expect(screen.getByText('Multiple teams').closest('a')!.href).toContain(
    'http://user',
  );
});

it('renders the user alumni badge', () => {
  render(
    <UserCommentHeader {...props} alumniSinceDate="2023-07-04T03:00:00.000Z" />,
  );
  expect(screen.getByTitle('Alumni Member')).toBeInTheDocument();
});

it('renders the user avatar', () => {
  render(<UserCommentHeader {...props} />);
  expect(screen.getByLabelText(/pic.+John Doe/i)).toBeVisible();
});

it('renders a fallback for the user avatar', () => {
  render(<UserCommentHeader {...props} />);
  expect(screen.getByText(/^[A-Z]{2}$/).textContent).toMatchInlineSnapshot(
    `"JD"`,
  );
});
