import { render, screen } from '@testing-library/react';
import UsersPage from '../UsersPage';

describe('UsersPage', () => {
  it('renders a banner', () => {
    render(<UsersPage />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
});
