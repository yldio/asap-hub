import { ArticleItem, ListResponse } from '@asap-hub/model';
import {
  FETCH_AIM_ARTICLES,
  FETCH_AIMS_WITH_MILESTONES,
  FETCH_MILESTONES,
  FETCH_PROJECTS_WITH_AIMS,
  FETCH_PROJECTS_WITH_AIMS_DETAIL,
  FetchAimArticlesQuery,
  FetchAimArticlesQueryVariables,
  GraphQLClient,
  FETCH_MILESTONE_ARTICLES,
  FetchMilestoneArticlesQuery,
  FetchMilestoneArticlesQueryVariables,
} from '@asap-hub/contentful';
import { cleanArray } from '@asap-hub/server-common';

import {
  AimWithMilestonesDataObject,
  AimsMilestonesDataProvider,
  MilestoneDataObject,
  ProjectWithAimsDataObject,
  ProjectWithAimsDetailDataObject,
} from '../types';

export class AimsMilestonesContentfulDataProvider
  implements AimsMilestonesDataProvider
{
  constructor(private contentfulClient: GraphQLClient) {}

  async fetchProjectsWithAims(options: {
    limit: number;
    skip: number;
  }): Promise<ListResponse<ProjectWithAimsDataObject>> {
    const { limit, skip } = options;

    const { projectsCollection } = await this.contentfulClient.request<{
      projectsCollection: {
        total: number;
        items: (ProjectWithAimsDataObject | null)[];
      } | null;
    }>(FETCH_PROJECTS_WITH_AIMS, { limit, skip });

    return {
      total: projectsCollection?.total || 0,
      items:
        (projectsCollection?.items?.filter(
          Boolean,
        ) as ProjectWithAimsDataObject[]) || [],
    };
  }

  async fetchProjectsWithAimsDetail(options: {
    limit: number;
    skip: number;
  }): Promise<ListResponse<ProjectWithAimsDetailDataObject>> {
    const { limit, skip } = options;

    const { projectsCollection } = await this.contentfulClient.request<{
      projectsCollection: {
        total: number;
        items: (ProjectWithAimsDetailDataObject | null)[];
      } | null;
    }>(FETCH_PROJECTS_WITH_AIMS_DETAIL, { limit, skip });

    return {
      total: projectsCollection?.total || 0,
      items:
        (projectsCollection?.items?.filter(
          Boolean,
        ) as ProjectWithAimsDetailDataObject[]) || [],
    };
  }

  async fetchAimsWithMilestones(options: {
    limit: number;
    skip: number;
  }): Promise<ListResponse<AimWithMilestonesDataObject>> {
    const { limit, skip } = options;

    const { aimsCollection } = await this.contentfulClient.request<{
      aimsCollection: {
        total: number;
        items: (AimWithMilestonesDataObject | null)[];
      } | null;
    }>(FETCH_AIMS_WITH_MILESTONES, { limit, skip });

    return {
      total: aimsCollection?.total || 0,
      items:
        (aimsCollection?.items?.filter(
          Boolean,
        ) as AimWithMilestonesDataObject[]) || [],
    };
  }

  async fetchMilestones(options: {
    limit: number;
    skip: number;
  }): Promise<ListResponse<MilestoneDataObject>> {
    const { limit, skip } = options;

    const { milestonesCollection } = await this.contentfulClient.request<{
      milestonesCollection: {
        total: number;
        items: (MilestoneDataObject | null)[];
      } | null;
    }>(FETCH_MILESTONES, { limit, skip });

    return {
      total: milestonesCollection?.total || 0,
      items:
        (milestonesCollection?.items?.filter(
          Boolean,
        ) as MilestoneDataObject[]) || [],
    };
  }

  async fetchArticlesForAim(
    aimId: string,
  ): Promise<ReadonlyArray<ArticleItem>> {
    const { aims } = await this.contentfulClient.request<
      FetchAimArticlesQuery,
      FetchAimArticlesQueryVariables
    >(FETCH_AIM_ARTICLES, { id: aimId });

    if (!aims?.milestonesCollection) {
      return [];
    }

    const seen = new Set<string>();

    const articles = aims.milestonesCollection.items.flatMap((milestone) => {
      if (!milestone?.relatedArticlesCollection) return [];
      return milestone.relatedArticlesCollection.items.flatMap((article) => {
        if (!article || seen.has(article.sys.id)) return [];
        seen.add(article.sys.id);
        return [
          {
            id: article.sys.id,
            title: article.title ?? '',
            href: `/shared-research/${article.sys.id}`,
          },
        ];
      });
    });

    return articles;
  }

  async fetchArticlesForMilestone(
    milestoneId: string,
  ): Promise<ReadonlyArray<ArticleItem>> {
    const { milestones } = await this.contentfulClient.request<
      FetchMilestoneArticlesQuery,
      FetchMilestoneArticlesQueryVariables
    >(FETCH_MILESTONE_ARTICLES, { id: milestoneId });

    if (!milestones) {
      return [];
    }

    const articles = cleanArray(
      milestones.relatedArticlesCollection?.items,
    ).map((article) => ({
      id: article.sys.id,
      title: article.title ?? '',
      href: `/shared-research/${article.sys.id}`,
    }));
    return articles;
  }
}
