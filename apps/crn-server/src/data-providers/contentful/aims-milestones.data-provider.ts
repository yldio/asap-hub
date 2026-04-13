import { ArticleItem, ListResponse } from '@asap-hub/model';
import {
  FETCH_AIM_ARTICLES,
  FETCH_AIMS_WITH_MILESTONES,
  FETCH_AIMS_LINKED_TO_MILESTONE,
  FETCH_AIM_WITH_MILESTONES_BY_ID,
  FETCH_MILESTONE_ARTICLES,
  FETCH_MILESTONE_BY_ID,
  FETCH_MILESTONES,
  FETCH_PROJECT_WITH_AIMS_DETAIL_BY_AIM_ID,
  FETCH_PROJECT_WITH_AIMS_DETAIL_BY_ID,
  FETCH_PROJECT_ID_BY_MEMBERSHIP_ID,
  FETCH_PROJECT_ID_BY_SUPPLEMENT_GRANT_ID,
  FETCH_PROJECTS_WITH_AIMS,
  FETCH_PROJECTS_WITH_AIMS_DETAIL,
  FetchAimArticlesQuery,
  FetchAimArticlesQueryVariables,
  FetchMilestoneArticlesQuery,
  FetchMilestoneArticlesQueryVariables,
  GraphQLClient,
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

  async fetchAimIdsLinkedToMilestone(
    milestoneId: string,
  ): Promise<ReadonlyArray<string>> {
    const { milestones } = await this.contentfulClient.request<{
      milestones: {
        linkedFrom?: {
          aimsCollection?: {
            items: Array<{ sys: { id: string } } | null>;
          } | null;
        } | null;
      } | null;
    }>(FETCH_AIMS_LINKED_TO_MILESTONE, { milestoneId });

    return (
      milestones?.linkedFrom?.aimsCollection?.items
        ?.filter((item): item is NonNullable<typeof item> => item !== null)
        .map((item) => item.sys.id) ?? []
    );
  }

  async fetchProjectWithAimsDetailByAimId(
    aimId: string,
  ): Promise<ProjectWithAimsDetailDataObject | null> {
    const { aims } = await this.contentfulClient.request<{
      aims: {
        linkedFrom?: {
          projectsCollection?: {
            items: (ProjectWithAimsDetailDataObject | null)[];
          } | null;
          supplementGrantCollection?: {
            items: Array<{
              linkedFrom?: {
                projectsCollection?: {
                  items: (ProjectWithAimsDetailDataObject | null)[];
                } | null;
              } | null;
            } | null>;
          } | null;
        } | null;
      } | null;
    }>(FETCH_PROJECT_WITH_AIMS_DETAIL_BY_AIM_ID, { aimId });

    const directProject =
      aims?.linkedFrom?.projectsCollection?.items?.find(Boolean) ?? null;
    if (directProject) return directProject;

    const supplementProject =
      aims?.linkedFrom?.supplementGrantCollection?.items
        ?.find(Boolean)
        ?.linkedFrom?.projectsCollection?.items?.find(Boolean) ?? null;
    return supplementProject;
  }

  async fetchAimWithMilestonesById(
    aimId: string,
  ): Promise<AimWithMilestonesDataObject | null> {
    const { aims } = await this.contentfulClient.request<{
      aims: AimWithMilestonesDataObject | null;
    }>(FETCH_AIM_WITH_MILESTONES_BY_ID, { aimId });

    return aims;
  }

  async fetchMilestoneById(
    milestoneId: string,
  ): Promise<MilestoneDataObject | null> {
    const { milestones } = await this.contentfulClient.request<{
      milestones: MilestoneDataObject | null;
    }>(FETCH_MILESTONE_BY_ID, { milestoneId });

    return milestones;
  }

  async fetchProjectWithAimsDetailById(
    projectId: string,
  ): Promise<ProjectWithAimsDetailDataObject | null> {
    const { projects } = await this.contentfulClient.request<{
      projects: ProjectWithAimsDetailDataObject | null;
    }>(FETCH_PROJECT_WITH_AIMS_DETAIL_BY_ID, { projectId });

    return projects;
  }

  async fetchProjectIdByMembershipId(
    membershipId: string,
  ): Promise<string | null> {
    const { projectMembership } = await this.contentfulClient.request<{
      projectMembership: {
        linkedFrom?: {
          projectsCollection?: {
            items: Array<{ sys: { id: string } } | null>;
          } | null;
        } | null;
      } | null;
    }>(FETCH_PROJECT_ID_BY_MEMBERSHIP_ID, { membershipId });

    return (
      projectMembership?.linkedFrom?.projectsCollection?.items?.find(Boolean)
        ?.sys.id ?? null
    );
  }

  async fetchProjectIdBySupplementGrantId(
    supplementGrantId: string,
  ): Promise<string | null> {
    const { supplementGrant } = await this.contentfulClient.request<{
      supplementGrant: {
        linkedFrom?: {
          projectsCollection?: {
            items: Array<{ sys: { id: string } } | null>;
          } | null;
        } | null;
      } | null;
    }>(FETCH_PROJECT_ID_BY_SUPPLEMENT_GRANT_ID, { supplementGrantId });

    return (
      supplementGrant?.linkedFrom?.projectsCollection?.items?.find(Boolean)?.sys
        .id ?? null
    );
  }
}
