import { render, screen } from '@testing-library/react';
import UserKeywords from '../UserKeywords';

describe('UserKeywords', () => {
  it('renders keywords', () => {
    const keywords = [{ id: 'id', name: 'Python' } as const];
    render(<UserKeywords tags={keywords} />);
    expect(screen.getByRole('listitem').textContent).toBe('Python');
  });
  it('renders the right title', () => {
    render(<UserKeywords tags={[]} />);
    expect(screen.getByRole('heading', { name: 'Keywords' })).toBeVisible();
  });
  describe('if no keywords', () => {
    it('renders placeholder when theres an edit link', () => {
      const { rerender } = render(<UserKeywords tags={[]} />);
      expect(screen.queryByText(/help others/i)).not.toBeInTheDocument();
      rerender(<UserKeywords tags={[]} editHref="/" />);
      expect(screen.getByText(/help others/i)).toBeVisible();
    });
  });
});
