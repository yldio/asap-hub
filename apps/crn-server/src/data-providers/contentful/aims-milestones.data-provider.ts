import { ListResponse } from '@asap-hub/model';
import {
  FETCH_AIMS_WITH_MILESTONES,
  FETCH_MILESTONES,
  FETCH_PROJECTS_WITH_AIMS,
  GraphQLClient,
} from '@asap-hub/contentful';

import {
  AimWithMilestonesDataObject,
  AimsMilestonesDataProvider,
  MilestoneDataObject,
  ProjectWithAimsDataObject,
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
}
