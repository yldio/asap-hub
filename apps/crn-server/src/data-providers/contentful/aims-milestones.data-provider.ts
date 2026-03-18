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

    const result = await this.contentfulClient.rawRequest<
      {
        projectsCollection: {
          total: number;
          items: ProjectWithAimsDataObject[];
        };
      },
      { limit: number; skip: number }
    >(FETCH_PROJECTS_WITH_AIMS.loc?.source.body ?? '', {
      limit,
      skip,
    });

    const { projectsCollection } = result.data;

    return {
      total: projectsCollection?.total || 0,
      items:
        (projectsCollection?.items as unknown as ProjectWithAimsDataObject[]) ||
        [],
    };
  }

  async fetchAimsWithMilestones(options: {
    limit: number;
    skip: number;
  }): Promise<ListResponse<AimWithMilestonesDataObject>> {
    const { limit, skip } = options;

    const result = await this.contentfulClient.rawRequest<
      {
        aimsCollection: { total: number; items: AimWithMilestonesDataObject[] };
      },
      { limit: number; skip: number }
    >(FETCH_AIMS_WITH_MILESTONES.loc?.source.body ?? '', { limit, skip });

    const { aimsCollection } = result.data;

    return {
      total: aimsCollection?.total || 0,
      items:
        (aimsCollection?.items as unknown as AimWithMilestonesDataObject[]) ||
        [],
    };
  }

  async fetchMilestones(options: {
    limit: number;
    skip: number;
  }): Promise<ListResponse<MilestoneDataObject>> {
    const { limit, skip } = options;

    const result = await this.contentfulClient.rawRequest<
      { milestonesCollection: { total: number; items: MilestoneDataObject[] } },
      { limit: number; skip: number }
    >(FETCH_MILESTONES.loc?.source.body ?? '', {
      limit,
      skip,
    });

    const { milestonesCollection } = result.data;

    return {
      total: milestonesCollection?.total || 0,
      items:
        (milestonesCollection?.items as unknown as MilestoneDataObject[]) || [],
    };
  }
}
