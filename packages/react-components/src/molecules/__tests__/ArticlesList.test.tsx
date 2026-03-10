import { fireEvent, render, screen } from '@testing-library/react';

import ArticlesList from '../ArticlesList';
import type { ArticleItem } from '../ArticlesList';

const sampleArticles: ArticleItem[] = [
  { id: '1', title: 'First article', href: '/articles/1' },
  { id: '2', title: 'Second article', href: '/articles/2' },
];

describe('ArticlesList', () => {
  it('displays the article count in the header', () => {
    render(<ArticlesList articles={sampleArticles} />);
    expect(screen.getByText('Articles (2)')).toBeInTheDocument();
  });

  it('displays count as 0 when articles array is empty', () => {
    render(<ArticlesList articles={[]} />);
    expect(screen.getByText('Articles (0)')).toBeInTheDocument();
  });

  it('shows article titles as clickable links when expanded', () => {
    render(<ArticlesList articles={sampleArticles} initiallyExpanded />);
    expect(screen.getByRole('link', { name: 'First article' })).toHaveAttribute(
      'href',
      '/articles/1',
    );
    expect(
      screen.getByRole('link', { name: 'Second article' }),
    ).toHaveAttribute('href', '/articles/2');
  });

  it('toggles expansion when the header button is clicked', () => {
    render(<ArticlesList articles={sampleArticles} initiallyExpanded />);
    expect(screen.getByRole('link', { name: 'First article' })).toBeVisible();

    const toggleButton = screen.getByRole('button', {
      name: 'Collapse articles',
    });
    fireEvent.click(toggleButton);

    expect(
      screen.queryByRole('link', { name: 'First article' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Expand articles' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Expand articles' }));
    expect(screen.getByRole('link', { name: 'First article' })).toBeVisible();
  });

  it('starts collapsed when initiallyExpanded is false', () => {
    render(
      <ArticlesList articles={sampleArticles} initiallyExpanded={false} />,
    );
    expect(
      screen.queryByRole('link', { name: 'First article' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Articles (2)')).toBeInTheDocument();
  });

  it('renders a scrollable list container when expanded', () => {
    const { container } = render(
      <ArticlesList articles={sampleArticles} initiallyExpanded />,
    );
    const listWrapper = container.querySelector('ul')?.parentElement;
    expect(listWrapper).toHaveStyle({ overflowY: 'auto' });
  });
});
