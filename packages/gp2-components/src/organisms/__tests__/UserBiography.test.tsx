import { render, screen } from '@testing-library/react';
import UserBiography from '../UserBiography';

describe('UserBiography', () => {
  it('renders biography', () => {
    const biography = 'This is the Biography';
    render(<UserBiography biography={biography} />);
    expect(screen.getByText(biography)).toBeVisible();
  });
  it('renders the right title', () => {
    render(<UserBiography />);
    expect(screen.getByRole('heading', { name: 'Biography' })).toBeVisible();
  });
  describe('if no biography', () => {
    it('renders placeholder when theres an edit link', () => {
      const { rerender } = render(<UserBiography />);
      expect(screen.queryByText(/summarize your/i)).toBeNull();
      rerender(<UserBiography editHref="/" />);
      expect(screen.getByText(/summarize your/i)).toBeVisible();
    });
  });
});
