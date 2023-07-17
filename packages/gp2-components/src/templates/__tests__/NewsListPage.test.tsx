import { render, screen } from '@testing-library/react';
import NewsListPage from '../NewsListPage';

describe('NewsListPage', () => {
  it('renders news title', () => {
    render(<NewsListPage />);
    expect(screen.getByRole('heading', { name: 'News' })).toBeInTheDocument();
  });
});
