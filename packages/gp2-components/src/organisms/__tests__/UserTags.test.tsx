import { render, screen } from '@testing-library/react';
import UserTags from '../UserTags';

describe('UserTags', () => {
  it('renders tags', () => {
    const tags = [{ id: 'id', name: 'Python' } as const];
    render(<UserTags tags={tags} />);
    expect(screen.getByRole('listitem').textContent).toBe('Python');
  });
  it('renders the right title', () => {
    render(<UserTags tags={[]} />);
    expect(screen.getByRole('heading', { name: 'Tags' })).toBeVisible();
  });
  describe('if no tags', () => {
    it('renders placeholder when theres an edit link', () => {
      const { rerender } = render(<UserTags tags={[]} />);
      expect(screen.queryByText(/help others/i)).not.toBeInTheDocument();
      rerender(<UserTags tags={[]} editHref="/" />);
      expect(screen.getByText(/help others/i)).toBeVisible();
    });
  });
});
