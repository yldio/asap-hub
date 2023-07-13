import { render, screen } from '@testing-library/react';
import NewsItem from '../NewsItem';

describe('NewsItem', () => {
  const newsProps = {
    title: 'News Title',
    shortText: 'News short text',
    created: '2021-01-01T00:00:00.000Z',
    linkText: 'News link text',
    link: 'https://www.google.com',
    id: '1',
    type: 'news' as const,
  };

  it('renders correctly', () => {
    render(<NewsItem {...newsProps} />);
    expect(
      screen.getByRole('heading', { name: 'News Title' }),
    ).toBeInTheDocument();
    expect(screen.getByText('News short text')).toBeInTheDocument();
    expect(screen.getByText('News link text')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /News link text/i }),
    ).toHaveAttribute('href', 'https://www.google.com');
  });
  it('doesnt render link if link is not provided', () => {
    render(<NewsItem {...newsProps} link={undefined} />);
    expect(screen.queryByText('News link text')).not.toBeInTheDocument();
  });
});
