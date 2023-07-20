import { render, screen } from '@testing-library/react';
import NewsPage from '../NewsPage';

describe('NewsPage', () => {
  it('renders news title', () => {
    render(<NewsPage />);
    expect(screen.getByRole('heading', { name: 'News' })).toBeInTheDocument();
  });
});
