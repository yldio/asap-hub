import { render, screen } from '@testing-library/react';
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
