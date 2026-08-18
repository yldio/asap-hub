import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

import { TestApiProvider } from '../../api/ApiProvider';
import type { Api } from '../../api/client';
import type { Folder, Video } from '../../api/types';
import { makeVideo } from '../../test-utils';
import { useSearchResults } from '../useSearchResults';

const folders: Folder[] = [
  { id: 'ROOT', name: 'Root' },
  { id: 'f-eng', name: 'Engineering' },
  { id: 'f-design', name: 'Design' },
];

const byFolder: Record<string, Video[]> = {
  ROOT: [makeVideo({ id: 'v-root', title: 'Unfiled sprint notes' })],
  'f-eng': [makeVideo({ id: 'v-eng', title: 'Sprint retro' })],
  'f-design': [makeVideo({ id: 'v-design', title: 'Brand review' })],
};

const renderSearch = (query: string, listVideos: jest.Mock) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <TestApiProvider api={{ listVideos } as unknown as Partial<Api>}>
        {children}
      </TestApiProvider>
    </QueryClientProvider>
  );
  return renderHook(({ q }) => useSearchResults(folders, q), {
    wrapper,
    initialProps: { q: query },
  });
};

const listVideosMock = () =>
  jest.fn((folderId?: string) =>
    Promise.resolve(byFolder[folderId ?? 'ROOT'] ?? []),
  );

it('fans out one request per folder and keeps the matches with their folder', async () => {
  const listVideos = listVideosMock();
  const { result } = renderSearch('sprint', listVideos);

  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(listVideos).toHaveBeenCalledTimes(folders.length);
  expect(listVideos.mock.calls.map(([id]) => id)).toEqual([
    'ROOT',
    'f-eng',
    'f-design',
  ]);
  expect(
    result.current.results.map(({ video, folderId }) => [video.id, folderId]),
  ).toEqual([
    ['v-root', 'ROOT'],
    ['v-eng', 'f-eng'],
  ]);
});

it('matches the title case-insensitively', async () => {
  const listVideos = listVideosMock();
  const { result } = renderSearch('BRAND', listVideos);

  await waitFor(() =>
    expect(result.current.results.map(({ video }) => video.id)).toEqual([
      'v-design',
    ]),
  );
});

it('stays idle and issues no request for an empty query', () => {
  const listVideos = listVideosMock();
  const { result } = renderSearch('   ', listVideos);

  expect(result.current).toEqual({ results: [], isLoading: false });
  expect(listVideos).not.toHaveBeenCalled();
});

it('starts the sweep only once a query arrives', async () => {
  const listVideos = listVideosMock();
  const { result, rerender } = renderSearch('', listVideos);

  expect(listVideos).not.toHaveBeenCalled();

  rerender({ q: 'sprint' });

  await waitFor(() => expect(result.current.results).toHaveLength(2));
  expect(listVideos).toHaveBeenCalledTimes(folders.length);
});
