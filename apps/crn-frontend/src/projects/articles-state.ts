import type { ArticleItem } from '@asap-hub/model';
import { atomFamily, useRecoilCallback } from 'recoil';
import { authorizationState } from '../auth/state';
import {
  getAimArticles,
  getMilestoneArticles,
  putMilestoneArticles,
} from './api';

/**
 * Cache for articles by aim id.
 */
export const aimArticlesState = atomFamily<
  ReadonlyArray<ArticleItem> | undefined,
  string
>({
  key: 'aimArticles',
  default: undefined,
});

/**
 * Returns a function that fetches articles for an aim from the real API,
 * updates Recoil cache, and returns the list. Use when expanding an aim's
 * articles section.
 */
export const useFetchAimArticles = (): ((
  aimId: string,
) => Promise<ReadonlyArray<ArticleItem>>) =>
  useRecoilCallback(({ set, snapshot }) => async (aimId: string) => {
    const cached = await snapshot.getPromise(aimArticlesState(aimId));
    if (cached !== undefined) {
      return cached;
    }
    const authorization = await snapshot.getPromise(authorizationState);
    const articles = await getAimArticles(aimId, authorization);
    set(aimArticlesState(aimId), articles);
    return articles;
  });

export const milestoneArticlesState = atomFamily<
  ReadonlyArray<ArticleItem> | undefined,
  string
>({
  key: 'milestoneArticles',
  default: undefined,
});

export const useFetchMilestoneArticles = (): ((
  milestoneId: string,
) => Promise<ReadonlyArray<ArticleItem>>) =>
  useRecoilCallback(({ set, snapshot }) => async (milestoneId: string) => {
    const cached = await snapshot.getPromise(
      milestoneArticlesState(milestoneId),
    );
    if (cached !== undefined) {
      return cached;
    }
    const authorization = await snapshot.getPromise(authorizationState);
    const articles = await getMilestoneArticles(milestoneId, authorization);
    set(milestoneArticlesState(milestoneId), articles);
    return articles;
  });

export const useUpdateMilestoneArticles = (): ((
  milestoneId: string,
  articles: ReadonlyArray<ArticleItem>,
) => Promise<void>) =>
  useRecoilCallback(({ set, snapshot }) => async (milestoneId, articles) => {
    const authorization = await snapshot.getPromise(authorizationState);
    await putMilestoneArticles(
      milestoneId,
      articles.map((a) => a.id),
      authorization,
    );
    set(milestoneArticlesState(milestoneId), articles);
  });
