import { useEffect, useState } from 'react';

import type { Video } from '../api/types';

export type ViewMode = 'grid' | 'list';
export type SortMode = 'newest' | 'oldest' | 'title';
export type StatusFilter = 'all' | 'published' | 'drafts';

const viewModeKey = 'demo-hub.library.view';

const readViewMode = (): ViewMode => {
  try {
    return window.localStorage.getItem(viewModeKey) === 'list'
      ? 'list'
      : 'grid';
  } catch {
    return 'grid';
  }
};

export const useViewMode = (): [ViewMode, (mode: ViewMode) => void] => {
  const [mode, setMode] = useState<ViewMode>(readViewMode);
  return [
    mode,
    (next: ViewMode) => {
      setMode(next);
      try {
        window.localStorage.setItem(viewModeKey, next);
      } catch {
        // a blocked storage should not break the toggle
      }
    },
  ];
};

export const useDebounced = <T>(value: T, delayMs: number): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
};

export const sortLabels: Record<SortMode, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  title: 'Title A-Z',
};

export const statusFilterLabels: Record<StatusFilter, string> = {
  all: 'All statuses',
  published: 'Published',
  drafts: 'Drafts',
};

export const nextStatusFilter = (current: StatusFilter): StatusFilter => {
  if (current === 'all') return 'published';
  return current === 'published' ? 'drafts' : 'all';
};

export const sortVideos = (
  videos: readonly Video[],
  mode: SortMode,
): Video[] => {
  const sorted = [...videos];
  if (mode === 'title') {
    return sorted.sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
    );
  }
  return sorted.sort((a, b) => {
    const comparison = a.recordedAt.localeCompare(b.recordedAt);
    return mode === 'newest' ? -comparison : comparison;
  });
};

export const matchesStatusFilter = (
  video: Video,
  filter: StatusFilter,
): boolean => {
  if (filter === 'published') return video.status === 'published';
  if (filter === 'drafts') return video.status === 'draft';
  return true;
};

export const matchesQuery = (video: Video, query: string): boolean =>
  video.title.toLowerCase().includes(query.toLowerCase());

export const thumbnailUrl = (videoId: string): string =>
  `/media/${encodeURIComponent(videoId)}/thumb.jpg`;
