import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { fireEvent } from '@testing-library/dom';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getNews } from '../api';
import NewsPage from '../Routes';

jest.mock('../api');

const mockGetNews = getNews as jest.MockedFunction<typeof getNews>;
const pageSize = 10;

beforeEach(jest.resetAllMocks);

mockConsoleError();
const renderPage = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/news']}>
              <Route path="/news">
                <NewsPage />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

it('renders the page title', async () => {
  const numberOfItems = 20;
  const news = gp2Fixtures.createListNewsResponse(pageSize, numberOfItems);

  mockGetNews.mockResolvedValue(news);

  await renderPage();

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/News/i);
});

it('renders a counter with the total number of items', async () => {
  const numberOfItems = 20;
  mockGetNews.mockResolvedValue(
    gp2Fixtures.createListNewsResponse(pageSize, numberOfItems),
  );

  await renderPage();
  await waitFor(() => expect(mockGetNews).toHaveBeenCalled());
  expect(screen.getByText(`${numberOfItems} results found`)).toBeVisible();
});

it('renders a paginated list of news', async () => {
  const numberOfItems = 40;
  mockGetNews.mockResolvedValue(
    gp2Fixtures.createListNewsResponse(pageSize, numberOfItems),
  );

  await renderPage();
  expect(screen.getAllByText('News Item')).toHaveLength(pageSize);
  expect(screen.getByTitle(/next page/i).closest('a')).toHaveAttribute(
    'href',
    '/?currentPage=1',
  );
  expect(screen.getByTitle(/last page/i).closest('a')).toHaveAttribute(
    'href',
    '/?currentPage=3',
  );
});

it('renders error message when when the request it not a 2XX', async () => {
  mockGetNews.mockRejectedValue(new Error('error'));

  await renderPage();
  expect(mockGetNews).toHaveBeenCalled();
  expect(screen.getByText(/Something went wrong/i)).toBeVisible();
});

it('can perform a search', async () => {
  mockGetNews.mockResolvedValue(gp2Fixtures.createListNewsResponse(pageSize));
  await renderPage();
  fireEvent.change(screen.getByPlaceholderText(/Enter name/i), {
    target: { value: 'example' },
  });
  await waitFor(() =>
    expect(mockGetNews).toHaveBeenLastCalledWith(
      expect.objectContaining({ searchQuery: 'example' }),
      expect.anything(),
    ),
  );
});

it('can perform a filter search', async () => {
  mockGetNews.mockResolvedValue(gp2Fixtures.createListNewsResponse(pageSize));
  await renderPage();
  userEvent.click(screen.getByTitle('Filter'));
  userEvent.click(screen.getByRole('checkbox', { name: /Newsletters/i }));

  await waitFor(() =>
    expect(mockGetNews).toHaveBeenLastCalledWith(
      expect.objectContaining({ filters: new Set('news') }),
      expect.anything(),
    ),
  );
});
