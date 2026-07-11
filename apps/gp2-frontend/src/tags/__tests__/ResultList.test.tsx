import { ClientSearchResponse } from '@asap-hub/algolia';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import {
  createAlgoliaResponse,
  createEventListAlgoliaResponse,
  createNewsListAlgoliaResponse,
  createOutputListAlgoliaResponse,
  createProjectListAlgoliaResponse,
  createUserListAlgoliaResponse,
  createWorkingGroupListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import { getTagSearchResults } from '../api';
import ResultList, { ResultListProps } from '../ResultList';

jest.mock('../api');

const renderList = async (props: ResultListProps, tag?: string) => {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[tag ? `/tags?tag=${tag}` : '/tags']}>
              <ResultList {...props} />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>,
  );
  return waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
};
beforeEach(() => {
  jest.resetAllMocks();
});

describe('ResultList', () => {
  const mockGetTagSearchResults = getTagSearchResults as jest.MockedFunction<
    typeof getTagSearchResults
  >;
  it('renders events', async () => {
    mockGetTagSearchResults.mockResolvedValue(
      createEventListAlgoliaResponse(1),
    );
    await renderList({}, 'test');
    expect(screen.getByRole('link', { name: 'Event 0' })).toBeInTheDocument();
  });

  it('renders users', async () => {
    mockGetTagSearchResults.mockResolvedValue(createUserListAlgoliaResponse(1));
    await renderList({}, 'test');
    expect(
      screen.getByRole('link', { name: 'Tony Stark 0, PhD' }),
    ).toBeInTheDocument();
  });

  it('renders projects', async () => {
    mockGetTagSearchResults.mockResolvedValue(
      createProjectListAlgoliaResponse(1),
    );
    await renderList({}, 'test');
    expect(
      screen.getByRole('link', { name: 'Project Title' }),
    ).toBeInTheDocument();
  });

  it('renders outputs', async () => {
    mockGetTagSearchResults.mockResolvedValue(
      createOutputListAlgoliaResponse(1),
    );
    await renderList({ filters: new Set() }, 'test');
    expect(screen.getByRole('link', { name: 'Output 1' })).toBeInTheDocument();
  });

  it('renders news', async () => {
    mockGetTagSearchResults.mockResolvedValue(
      createNewsListAlgoliaResponse(1, 1),
    );
    await renderList({}, 'test');
    expect(screen.getByText('News Item')).toBeInTheDocument();
  });

  it('renders working groups', async () => {
    mockGetTagSearchResults.mockResolvedValue(
      createWorkingGroupListAlgoliaResponse(1, 1),
    );
    await renderList({}, 'test');
    expect(screen.getByText(/Working Group/i)).toBeInTheDocument();
  });

  it('does not render unsupported types', async () => {
    const response = createAlgoliaResponse<'external-user'>([
      {
        __meta: { type: 'external-user' },
        displayName: 'John Doe',
        id: 'external-1',
        objectID: '1',
      },
    ]);

    mockGetTagSearchResults.mockResolvedValue(
      response as unknown as ClientSearchResponse<
        'gp2',
        'output' | 'event' | 'user' | 'news' | 'project'
      >,
    );

    await renderList({ filters: new Set() }, 'test');

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('renders empty state', async () => {
    mockGetTagSearchResults.mockResolvedValue(
      createAlgoliaResponse<'event'>([]),
    );
    await renderList({ filters: new Set() });
    expect(
      screen.getByRole('heading', { name: 'Explore any tags.' }),
    ).toBeInTheDocument();
  });
});
