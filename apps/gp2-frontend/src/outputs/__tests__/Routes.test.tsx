import { mockConsoleError } from '@asap-hub/dom-test-utils';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import {
  MemoryRouter,
  Route,
  Routes as ReactRouterRoutes,
} from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { gp2 } from '@asap-hub/model';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { createOutputListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getOutputs } from '../api';
import Routes from '../Routes';

jest.mock('../api');
const mockGetOutputs = getOutputs as jest.MockedFunction<typeof getOutputs>;

mockConsoleError();

jest.setTimeout(30_000);
const renderRoutes = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/outputs']}>
              <ReactRouterRoutes>
                <Route path="/outputs/*" element={<Routes />} />
              </ReactRouterRoutes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i), {
    timeout: 30_000,
  });
};
beforeEach(jest.resetAllMocks);

describe('Routes', () => {
  it('renders the title', async () => {
    mockGetOutputs.mockResolvedValue(createOutputListAlgoliaResponse(0));
    await renderRoutes();
    expect(
      screen.getByRole('heading', { name: 'Outputs' }),
    ).toBeInTheDocument();
  });

  it('renders a list of  outputs', async () => {
    mockGetOutputs.mockResolvedValue(createOutputListAlgoliaResponse(2));
    await renderRoutes();
    expect(screen.getByText(/2 results found/i)).toBeVisible();
    expect(screen.getByText('Output 1')).toBeVisible();
    expect(screen.getByText('Output 2')).toBeVisible();
  });
  it('renders when when the request it not a 2XX', async () => {
    mockGetOutputs.mockRejectedValue(new Error('error'));

    await renderRoutes();
    expect(mockGetOutputs).toHaveBeenCalled();
    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });
  const pageSize = 10;
  it('renders the page title', async () => {
    const nbHits = 20;
    const news = createOutputListAlgoliaResponse(pageSize, { nbHits });

    mockGetOutputs.mockResolvedValue(news);

    await renderRoutes();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /Outputs/i,
    );
  });

  it('renders a counter with the total number of items', async () => {
    const nbHits = 20;
    mockGetOutputs.mockResolvedValue(
      createOutputListAlgoliaResponse(pageSize, { nbHits }),
    );

    await renderRoutes();
    await waitFor(() => expect(mockGetOutputs).toHaveBeenCalled());
    expect(screen.getByText(`${nbHits} results found`)).toBeVisible();
  });

  it('renders a paginated list of outputs', async () => {
    const nbHits = 40;
    mockGetOutputs.mockResolvedValue(
      createOutputListAlgoliaResponse(pageSize, { nbHits }),
    );

    await renderRoutes();
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

    await renderRoutes();
    expect(mockGetOutputs).toHaveBeenCalled();
    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });

  it('can perform a search', async () => {
    mockGetOutputs.mockResolvedValue(createOutputListAlgoliaResponse(pageSize));
    await renderRoutes();
    userEvent.type(screen.getByPlaceholderText(/Enter name/i), 'example');
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
      mockGetOutputs.mockResolvedValue(
        createOutputListAlgoliaResponse(pageSize),
      );
      await renderRoutes();
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
});
