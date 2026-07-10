import type {
  ArticleItem,
  ListProjectMilestonesResponse,
  Milestone,
  MilestoneStatus,
} from '@asap-hub/model';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useAuthorization } from '../auth/useAuthorization';
import {
  getAimArticles,
  getMilestoneArticles,
  patchMilestone,
  putMilestoneArticles,
} from './api';
import { projectMilestoneQueryKeys } from './state';

export const articleQueryKeys = {
  all: ['articles'] as const,
  aim: (aimId: string) => [...articleQueryKeys.all, 'aim', aimId] as const,
  milestone: (milestoneId: string) =>
    [...articleQueryKeys.all, 'milestone', milestoneId] as const,
};

// Cross-cache write into projects/state's milestone lists after a mutation:
// the recoil version wrote projectMilestonesListItemState(milestoneId), the
// entity every cached milestone list joined over, to keep articleCount/status
// in sync (R10 write-through — never a refetch).
const updateCachedMilestone = (
  queryClient: QueryClient,
  milestoneId: string,
  update: (milestone: Milestone) => Milestone,
) => {
  queryClient.setQueriesData<ListProjectMilestonesResponse>(
    { queryKey: projectMilestoneQueryKeys.lists() },
    (previous) =>
      previous && {
        ...previous,
        items: previous.items.map((milestone) =>
          milestone.id === milestoneId ? update(milestone) : milestone,
        ),
      },
  );
};

/**
 * Returns a function that fetches articles for an aim from the real API,
 * updates the query cache, and returns the list. Use when expanding an aim's
 * articles section.
 */
export const useFetchAimArticles = (): ((
  aimId: string,
) => Promise<ReadonlyArray<ArticleItem>>) => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return useCallback(
    async (aimId: string) => {
      const cached = queryClient.getQueryData<ReadonlyArray<ArticleItem>>(
        articleQueryKeys.aim(aimId),
      );
      if (cached !== undefined) {
        return cached;
      }
      const articles = await getAimArticles(aimId, await getAuthorization());
      queryClient.setQueryData(articleQueryKeys.aim(aimId), articles);
      return articles;
    },
    [queryClient, getAuthorization],
  );
};

export const useFetchMilestoneArticles = (): ((
  milestoneId: string,
) => Promise<ReadonlyArray<ArticleItem>>) => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return useCallback(
    async (milestoneId: string) => {
      const cached = queryClient.getQueryData<ReadonlyArray<ArticleItem>>(
        articleQueryKeys.milestone(milestoneId),
      );
      if (cached !== undefined) {
        return cached;
      }
      const articles = await getMilestoneArticles(
        milestoneId,
        await getAuthorization(),
      );
      queryClient.setQueryData(
        articleQueryKeys.milestone(milestoneId),
        articles,
      );
      return articles;
    },
    [queryClient, getAuthorization],
  );
};

export const useUpdateMilestoneArticles = (): ((
  milestoneId: string,
  articles: ReadonlyArray<ArticleItem>,
) => Promise<void>) => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return useCallback(
    async (milestoneId, articles) => {
      await putMilestoneArticles(
        milestoneId,
        articles.map((a) => a.id),
        await getAuthorization(),
      );
      queryClient.setQueryData(
        articleQueryKeys.milestone(milestoneId),
        articles,
      );

      updateCachedMilestone(queryClient, milestoneId, (milestone) => ({
        ...milestone,
        articleCount: articles.length,
      }));
    },
    [queryClient, getAuthorization],
  );
};

export const useUpdateMilestone = (): ((
  milestoneId: string,
  update: { status?: MilestoneStatus; articles?: ReadonlyArray<ArticleItem> },
) => Promise<void>) => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return useCallback(
    async (milestoneId, update) => {
      const articleIds = update.articles?.map((a) => a.id);
      await patchMilestone(
        milestoneId,
        {
          ...(update.status !== undefined && { status: update.status }),
          ...(articleIds !== undefined && { articleIds }),
        },
        await getAuthorization(),
      );

      if (update.articles !== undefined) {
        queryClient.setQueryData(
          articleQueryKeys.milestone(milestoneId),
          update.articles,
        );
      }

      updateCachedMilestone(queryClient, milestoneId, (milestone) => ({
        ...milestone,
        ...(update.status !== undefined && { status: update.status }),
        ...(update.articles !== undefined && {
          articleCount: update.articles.length,
        }),
      }));
    },
    [queryClient, getAuthorization],
  );
};
