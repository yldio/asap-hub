import { ListResponse } from '@asap-hub/model';

export type ProjectWithAimsDataObject = {
  originalGrantAimsCollection?: {
    items: Array<{
      sys: { id: string };
      description?: string | null;
    } | null>;
  } | null;
  supplementGrant?: {
    aimsCollection?: {
      items: Array<{
        sys: { id: string };
        description?: string | null;
      } | null>;
    } | null;
  } | null;
};

export type AimWithMilestonesDataObject = {
  sys: { id: string };
  milestonesCollection?: {
    items: Array<{
      sys: { id: string };
    } | null>;
  } | null;
};

export type MilestoneDataObject = {
  sys: {
    id: string;
    firstPublishedAt?: string | null;
    publishedAt?: string | null;
  };
  description?: string | null;
  status?: string | null;
  relatedArticlesCollection?: {
    total: number;
    items: Array<{
      doi?: string | null;
    } | null>;
  } | null;
};

export type AimsMilestonesDataProvider = {
  fetchProjectsWithAims: (
    options: { limit: number; skip: number },
  ) => Promise<ListResponse<ProjectWithAimsDataObject>>;
  fetchAimsWithMilestones: (
    options: { limit: number; skip: number },
  ) => Promise<ListResponse<AimWithMilestonesDataObject>>;
  fetchMilestones: (
    options: { limit: number; skip: number },
  ) => Promise<ListResponse<MilestoneDataObject>>;
};

