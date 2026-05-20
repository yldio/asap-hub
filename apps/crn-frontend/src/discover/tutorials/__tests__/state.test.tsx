import { createListTutorialsResponse } from '@asap-hub/fixtures';
import { TutorialsResponse } from '@asap-hub/model';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode, Suspense } from 'react';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getTutorialById, getTutorials } from '../api';
import { useTutorialById, useTutorials } from '../state';

jest.mock('../api');

const mockGetTutorials = getTutorials as jest.MockedFunction<
  typeof getTutorials
>;
const mockGetTutorialById = getTutorialById as jest.MockedFunction<
  typeof getTutorialById
>;

const wrap = (): ((props: { children: ReactNode }) => JSX.Element) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
  return ({ children }) => (
    <QueryClientProvider client={client}>
      <RecoilRoot>
        <Auth0Provider user={{}}>
          <WhenReady>
            <Suspense fallback={<span>loading</span>}>{children}</Suspense>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useTutorials', () => {
  it('fetches the list with bearer token and returns it', async () => {
    const response = createListTutorialsResponse(2);
    mockGetTutorials.mockResolvedValue(response);

    const { result } = renderHook(
      () =>
        useTutorials({
          searchQuery: '',
          currentPage: 0,
          pageSize: 10,
          filters: new Set(),
        }),
      { wrapper: wrap() },
    );

    await waitFor(() => expect(result.current).toEqual(response));
    expect(mockGetTutorials).toHaveBeenCalledWith(
      expect.objectContaining({ searchQuery: '' }),
      'Bearer access_token',
    );
  });
});

describe('useTutorialById', () => {
  it('returns the tutorial when one is found', async () => {
    const tutorial: TutorialsResponse = {
      id: 'tut-1',
      created: '2020-09-07T17:36:54Z',
      title: 'Hello',
      authors: [],
      tags: [],
      teams: [],
      relatedEvents: [],
      relatedTutorials: [],
    };
    mockGetTutorialById.mockResolvedValue(tutorial);

    const { result } = renderHook(() => useTutorialById('tut-1'), {
      wrapper: wrap(),
    });

    await waitFor(() => expect(result.current).toEqual(tutorial));
  });

  it('returns undefined when the API resolves with undefined', async () => {
    mockGetTutorialById.mockResolvedValue(undefined);

    const { result } = renderHook(() => useTutorialById('tut-missing'), {
      wrapper: wrap(),
    });

    await waitFor(() => expect(result.current).toBeUndefined());
    expect(mockGetTutorialById).toHaveBeenCalledWith(
      'tut-missing',
      'Bearer access_token',
    );
  });
});
