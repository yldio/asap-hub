import type { ArticleItem, MilestoneStatus } from '@asap-hub/model';
import { atomFamily, useRecoilCallback } from 'recoil';
import { authorizationState } from '../auth/state';
import {
  getAimArticles,
  getMilestoneArticles,
  patchMilestone,
  putMilestoneArticles,
} from './api';
import { projectMilestonesListItemState } from './state';

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

    set(projectMilestonesListItemState(milestoneId), (current) =>
      current ? { ...current, articleCount: articles.length } : current,
    );
  });

export const useUpdateMilestone = (): ((
  milestoneId: string,
  update: { status?: MilestoneStatus; articles?: ReadonlyArray<ArticleItem> },
) => Promise<void>) =>
  useRecoilCallback(({ set, snapshot }) => async (milestoneId, update) => {
    const authorization = await snapshot.getPromise(authorizationState);
    const articleIds = update.articles?.map((a) => a.id);
    await patchMilestone(
      milestoneId,
      {
        ...(update.status !== undefined && { status: update.status }),
        ...(articleIds !== undefined && { articleIds }),
      },
      authorization,
    );

    if (update.articles !== undefined) {
      set(milestoneArticlesState(milestoneId), update.articles);
    }

    set(projectMilestonesListItemState(milestoneId), (current) => {
      if (!current) return current;
      return {
        ...current,
        ...(update.status !== undefined && { status: update.status }),
        ...(update.articles !== undefined && {
          articleCount: update.articles.length,
        }),
      };
    });
  });
