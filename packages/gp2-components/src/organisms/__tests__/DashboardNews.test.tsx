import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardNews from '../DashboardNews';

describe('Dashboard News', () => {
  const defaultProps = gp2Fixtures.createNewsResponse();
  it('renders the title', () => {
    render(<DashboardNews {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'News and Updates' }),
    ).toBeVisible();
  });
  it('renders the first news item', () => {
    const firstNewsItem: gp2.NewsResponse = {
      ...defaultProps.items[0]!,
      title: 'First News Item',
      shortText: 'this is a short text',
    };
    render(<DashboardNews items={[firstNewsItem]} />);
    expect(
      screen.getByRole('heading', { name: 'First News Item' }),
    ).toBeVisible();
    expect(screen.getByText('this is a short text')).toBeVisible();
  });
  describe('multiple news events', () => {
    it('displays show more when theres more than 1 news item', () => {
      const newsItem: gp2.NewsResponse = {
        ...defaultProps.items[0]!,
        id: '1',
      };
      const { rerender } = render(<DashboardNews items={[newsItem]} />);
      expect(
        screen.queryByRole('button', { name: 'Chevron Down Show more' }),
      ).not.toBeInTheDocument();
      rerender(<DashboardNews items={[newsItem, { ...newsItem, id: '2' }]} />);
      expect(
        screen.getByRole('button', { name: 'Chevron Down Show more' }),
      ).toBeVisible();
    });
    it('display all news when pressing show more', () => {
      const firstNewsItem: gp2.NewsResponse = {
        ...defaultProps.items[0]!,
        id: '1',
        title: 'First News',
      };
      const secondNewsItem: gp2.NewsResponse = {
        ...defaultProps.items[0]!,
        id: '2',
        title: 'Second News',
      };
      render(<DashboardNews items={[firstNewsItem, secondNewsItem]} />);
      expect(screen.getByRole('heading', { name: 'First News' })).toBeVisible();
      expect(
        screen.queryByRole('heading', { name: 'Second News' }),
      ).not.toBeInTheDocument();
      userEvent.click(
        screen.getByRole('button', { name: 'Chevron Down Show more' }),
      );
      expect(
        screen.getByRole('heading', { name: 'Second News' }),
      ).toBeVisible();
    });
  });
});
