import { render, screen } from '@testing-library/react';
import UsersHeader from '../UsersHeader';

describe('UsersHeader', () => {
  it('renders a banner', () => {
    render(<UsersHeader />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
});
