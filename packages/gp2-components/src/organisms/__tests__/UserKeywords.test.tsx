import { render, screen } from '@testing-library/react';
import UserKeywords from '../UserKeywords';

describe('UserKeywords', () => {
  it('renders keywords', () => {
    const keywords = ['Python' as const];
    render(<UserKeywords keywords={keywords} />);
    expect(screen.getByRole('listitem').textContent).toBe('Python');
  });
  it('renders the right title', () => {
    render(<UserKeywords keywords={[]} />);
    expect(screen.getByRole('heading', { name: 'Keywords' })).toBeVisible();
  });
  describe('if no keywords', () => {
    it('renders placeholder when theres an edit link', () => {
      const { rerender } = render(<UserKeywords keywords={[]} />);
      expect(screen.queryByText(/help others/i)).not.toBeInTheDocument();
      rerender(<UserKeywords keywords={[]} editHref="/" />);
      expect(screen.getByText(/help others/i)).toBeVisible();
    });
  });
});
