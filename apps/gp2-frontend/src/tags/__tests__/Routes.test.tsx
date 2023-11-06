import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import {
  createAlgoliaResponse,
  createEventAlgoliaRecord,
  createOutputAlgoliaRecord,
} from '../../__fixtures__/algolia';

import { getTagSearchResults } from '../api';
import Routes from '../Routes';

jest.mock('../api');

mockConsoleError();

afterEach(() => {
  jest.resetAllMocks();
});

const mockGetTagSearchResults = getTagSearchResults as jest.MockedFunction<
  typeof getTagSearchResults
>;
const renderPage = async () => {
  render(
    <Suspense fallback="loading">
      <RecoilRoot>
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/tags']}>
              <Route path="/tags">
                <Routes />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>
    </Suspense>,
  );
  await waitFor(
    () => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    { timeout: 20000 },
  );
};

describe('Routes', () => {
  it('renders the title', async () => {
    mockGetTagSearchResults.mockResolvedValue(
      createAlgoliaResponse<'output'>([]),
    );
    await renderPage();
    expect(screen.getByRole('heading', { name: 'Tags Search' })).toBeVisible();
  });

  it('renders a list of search items', async () => {
    const items = createAlgoliaResponse<'event' | 'output'>([
      createEventAlgoliaRecord({ customTitle: 'Event' }),
      createOutputAlgoliaRecord(),
    ]);

    mockGetTagSearchResults.mockResolvedValue(items);
    await renderPage();

    expect(screen.getByText('Event 0')).toBeVisible();
    expect(screen.getByText('Output 1')).toBeVisible();
  });

  it('renders error message when the request is not a 2XX', async () => {
    mockGetTagSearchResults.mockRejectedValue(new Error('error'));

    await renderPage();
    expect(mockGetTagSearchResults).toHaveBeenCalled();
    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });
});
