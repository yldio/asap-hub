import type { ArticleItem } from '@asap-hub/model';
import { atomFamily, useRecoilCallback } from 'recoil';

/**
 * Cache for articles by aim id (e.g. after fetching via simulated or real API).
 */
export const aimArticlesState = atomFamily<
  ReadonlyArray<ArticleItem> | undefined,
  string
>({
  key: 'aimArticles',
  default: undefined,
});

/** Simulated delay to mimic network. */
const MOCK_DELAY_MS = 400;

/**
 * Static mock data: aim id -> list of articles.
 * Replace with real API call when backend is ready.
 */
const MOCK_ARTICLES_BY_AIM: Record<string, ReadonlyArray<ArticleItem>> = {
  'aim-1': [
    {
      id: 'art-1-1',
      title: 'Alpha-synuclein aggregation in dopaminergic neurons',
      href: '#',
    },
    {
      id: 'art-1-2',
      title: 'Imaging techniques for protein misfolding',
      href: '#',
    },
    {
      id: 'art-1-3',
      title: 'Biochemical assays in Parkinson models',
      href: '#',
    },
  ],
  'aim-2': [
    {
      id: 'art-2-1',
      title: 'Computational models for protein misfolding prediction',
      href: '#',
    },
  ],
  'aim-4': [
    {
      id: 'art-4-1',
      title: 'Gene therapy in synucleinopathy models',
      href: '#',
    },
    {
      id: 'art-4-2',
      title: 'Therapeutic targeting of alpha-synuclein',
      href: '#',
    },
  ],
  'aim-6': [
    {
      id: 'art-6-1',
      title: 'Multi-site replication of biomarker candidates',
      href: '#',
    },
  ],
};

/**
 * Simulates an API call: delay + return static list for the aim.
 */
const fetchArticlesForAim = (
  aimId: string,
): Promise<ReadonlyArray<ArticleItem>> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const articles = MOCK_ARTICLES_BY_AIM[aimId] ?? [];
      resolve(articles);
    }, MOCK_DELAY_MS);
  });

/**
 * Returns a function that fetches articles for an aim (simulated API),
 * updates Recoil cache, and returns the list. Use when expanding an aim's
 * articles section.
 */
export const useFetchArticles = (): ((
  aimId: string,
) => Promise<ReadonlyArray<ArticleItem>>) =>
  useRecoilCallback(
    ({ set }) =>
      (aimId: string) =>
        fetchArticlesForAim(aimId).then((articles) => {
          set(aimArticlesState(aimId), articles);
          return articles;
        }),
  );
