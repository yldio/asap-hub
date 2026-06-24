import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import AvatarWithBadge from '../AvatarWithBadge';

it('renders the avatar and the badge image', () => {
  render(
    <AvatarWithBadge
      firstName="John"
      lastName="Doe"
      badgeUrl="https://example.com/badge.png"
      badgeAlt="Open Science Champion"
    />,
  );

  expect(screen.getByLabelText(/profile picture/i)).toBeInTheDocument();
  expect(screen.getByAltText('Open Science Champion')).toHaveAttribute(
    'src',
    'https://example.com/badge.png',
  );
});

it('links the badge when a href is provided', () => {
  render(
    <MemoryRouter>
      <AvatarWithBadge
        firstName="John"
        lastName="Doe"
        badgeUrl="https://example.com/badge.png"
        badgeAlt="Open Science Champion"
        badgeHref="#badges"
      />
    </MemoryRouter>,
  );

  expect(
    screen
      .getByRole('link', { name: /open science champion/i })
      .getAttribute('href'),
  ).toContain('#badges');
});

it('does not render a link when no href is provided', () => {
  render(
    <AvatarWithBadge
      firstName="John"
      lastName="Doe"
      badgeUrl="https://example.com/badge.png"
      badgeAlt="Open Science Champion"
    />,
  );

  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});
