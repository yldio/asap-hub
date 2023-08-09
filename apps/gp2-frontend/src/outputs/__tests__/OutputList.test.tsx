import { mockConsoleError } from '@asap-hub/dom-test-utils';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { gp2 } from '@asap-hub/model';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { createOutputListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getOutputs } from '../api';
import OutputPage from '../Routes';

jest.mock('../api');

const mockGetOutputs = getOutputs as jest.MockedFunction<typeof getOutputs>;

const renderPage = async (searchQuery = '') => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/outputs']}>
              <Route path="/outputs">
                <OutputPage />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

beforeEach(jest.resetAllMocks);
mockConsoleError();

const pageSize = 10;
it('renders a list of outputs', async () => {
  mockGetOutputs.mockResolvedValue(createOutputListAlgoliaResponse(1));
  await renderPage();
  expect(screen.getByText(/1 result found/i)).toBeVisible();
  expect(screen.getByText('Output 1')).toBeVisible();
});

it('renders the page title', async () => {
  const nbHits = 20;
  const news = createOutputListAlgoliaResponse(pageSize, { nbHits });

  mockGetOutputs.mockResolvedValue(news);

  await renderPage();

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    /Outputs/i,
  );
});

it('renders a counter with the total number of items', async () => {
  const nbHits = 20;
  mockGetOutputs.mockResolvedValue(
    createOutputListAlgoliaResponse(pageSize, { nbHits }),
  );

  await renderPage();
  await waitFor(() => expect(mockGetOutputs).toHaveBeenCalled());
  expect(screen.getByText(`${nbHits} results found`)).toBeVisible();
});

it('renders a paginated list of news', async () => {
  const nbHits = 40;
  mockGetOutputs.mockResolvedValue(
    createOutputListAlgoliaResponse(pageSize, { nbHits }),
  );

  await renderPage();
  expect(screen.getAllByText(/Date Added/i)).toHaveLength(pageSize);
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
  mockGetOutputs.mockRejectedValue(new Error('error'));

  await renderPage();
  expect(mockGetOutputs).toHaveBeenCalled();
  expect(screen.getByText(/Something went wrong/i)).toBeVisible();
});

it('can perform a search', async () => {
  mockGetOutputs.mockResolvedValue(createOutputListAlgoliaResponse(pageSize));
  await renderPage();
  fireEvent.change(screen.getByPlaceholderText(/Enter name/i), {
    target: { value: 'example' },
  });
  await waitFor(() =>
    expect(mockGetOutputs).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ searchQuery: 'example' }),
    ),
  );
});

it.each(gp2.outputDocumentTypes)(
  'can perform a filter search %s',
  async (name) => {
    mockGetOutputs.mockResolvedValue(createOutputListAlgoliaResponse(pageSize));
    await renderPage();
    userEvent.click(screen.getByTitle('Filter'));
    userEvent.click(screen.getByRole('checkbox', { name }));

    await waitFor(() =>
      expect(mockGetOutputs).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ filters: new Set(name) }),
      ),
    );
  },
);
