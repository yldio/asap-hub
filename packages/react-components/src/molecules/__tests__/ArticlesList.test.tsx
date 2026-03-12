import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ArticleItem } from '@asap-hub/model';

import ArticlesList, { type ArticlesListProps } from '../ArticlesList';

const sampleArticles: ArticleItem[] = [
  { id: '1', title: 'First article', href: '/articles/1' },
  { id: '2', title: 'Second article', href: '/articles/2' },
];

const mockFetchArticles = jest.fn(() => Promise.resolve(sampleArticles));

describe('ArticlesList', () => {
  beforeEach(() => {
    mockFetchArticles.mockClear();
    mockFetchArticles.mockResolvedValue(sampleArticles);
  });

  it('uses default articlesCount of 0 when not provided', () => {
    const props = {
      aimId: 'aim-1',
      fetchArticles: mockFetchArticles,
    } as unknown as ArticlesListProps;
    render(<ArticlesList {...props} />);
    expect(screen.getByText('Articles (0)')).toBeInTheDocument();
  });

  it('displays the article count in the header', () => {
    render(
      <ArticlesList
        aimId="aim-1"
        articlesCount={2}
        fetchArticles={mockFetchArticles}
      />,
    );
    expect(screen.getByText('Articles (2)')).toBeInTheDocument();
  });

  it('fetches and shows article titles when expand is clicked', async () => {
    render(
      <ArticlesList
        aimId="aim-1"
        articlesCount={2}
        fetchArticles={mockFetchArticles}
      />,
    );
    expect(
      screen.queryByRole('link', { name: 'First article' }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Expand articles' }));

    await waitFor(() => {
      expect(mockFetchArticles).toHaveBeenCalledWith('aim-1');
    });
    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: 'First article' }),
      ).toHaveAttribute('href', '/articles/1');
    });
    expect(
      screen.getByRole('link', { name: 'Second article' }),
    ).toHaveAttribute('href', '/articles/2');
  });

  it('toggles expansion when the header button is clicked', async () => {
    render(
      <ArticlesList
        aimId="aim-1"
        articlesCount={2}
        initiallyExpanded={true}
        fetchArticles={mockFetchArticles}
      />,
    );
    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'First article' })).toBeVisible();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Collapse articles' }));

    expect(
      screen.queryByRole('link', { name: 'First article' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Expand articles' }),
    ).toBeInTheDocument();
  });

  it('starts collapsed when initiallyExpanded is false', () => {
    render(
      <ArticlesList
        aimId="aim-1"
        articlesCount={2}
        initiallyExpanded={false}
        fetchArticles={mockFetchArticles}
      />,
    );
    expect(
      screen.queryByRole('link', { name: 'First article' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Articles (2)')).toBeInTheDocument();
  });

  it('renders Edit button in the header', () => {
    render(
      <ArticlesList
        aimId="aim-1"
        articlesCount={2}
        fetchArticles={mockFetchArticles}
      />,
    );
    const editButton = screen.getByRole('button', { name: 'Edit' });
    expect(editButton).toBeInTheDocument();
  });

  it('does not fetch when collapsing', async () => {
    render(
      <ArticlesList
        aimId="aim-1"
        articlesCount={2}
        initiallyExpanded={true}
        fetchArticles={mockFetchArticles}
      />,
    );
    await waitFor(() => {
      expect(mockFetchArticles).toHaveBeenCalledTimes(1);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Collapse articles' }));
    expect(mockFetchArticles).toHaveBeenCalledTimes(1);
  });
});
