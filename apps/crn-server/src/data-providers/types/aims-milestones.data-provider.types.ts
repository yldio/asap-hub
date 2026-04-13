import { ArticleItem, ListResponse } from '@asap-hub/model';

export type ProjectWithAimsDataObject = {
  sys: { id: string };
  title?: string | null;
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
      sys: { id: string };
      doi?: string | null;
    } | null>;
  } | null;
};

type AimDetailDataObject = {
  sys: {
    id: string;
    firstPublishedAt?: string | null;
    publishedAt?: string | null;
  };
  description?: string | null;
};

export type ProjectWithAimsDetailDataObject = {
  sys: { id: string };
  title?: string | null;
  status?: string | null;
  membersCollection?: {
    items: Array<{
      projectMember?: {
        __typename: string;
        sys?: { id: string };
        displayName?: string | null;
      } | null;
    } | null>;
  } | null;
  originalGrantAimsCollection?: {
    items: Array<AimDetailDataObject | null>;
  } | null;
  supplementGrant?: {
    aimsCollection?: {
      items: Array<AimDetailDataObject | null>;
    } | null;
  } | null;
};

export type AimsMilestonesDataProvider = {
  fetchProjectsWithAims: (options: {
    limit: number;
    skip: number;
  }) => Promise<ListResponse<ProjectWithAimsDataObject>>;
  fetchProjectsWithAimsDetail: (options: {
    limit: number;
    skip: number;
  }) => Promise<ListResponse<ProjectWithAimsDetailDataObject>>;
  fetchAimsWithMilestones: (options: {
    limit: number;
    skip: number;
  }) => Promise<ListResponse<AimWithMilestonesDataObject>>;
  fetchMilestones: (options: {
    limit: number;
    skip: number;
  }) => Promise<ListResponse<MilestoneDataObject>>;
  fetchArticlesForAim: (aimId: string) => Promise<ReadonlyArray<ArticleItem>>;
  fetchArticlesForMilestone: (
    milestoneId: string,
  ) => Promise<ReadonlyArray<ArticleItem>>;
  fetchAimIdsLinkedToMilestone: (
    milestoneId: string,
  ) => Promise<ReadonlyArray<string>>;
  fetchProjectWithAimsDetailByAimId: (
    aimId: string,
  ) => Promise<ProjectWithAimsDetailDataObject | null>;
  fetchAimWithMilestonesById: (
    aimId: string,
  ) => Promise<AimWithMilestonesDataObject | null>;
  fetchMilestoneById: (
    milestoneId: string,
  ) => Promise<MilestoneDataObject | null>;
  fetchProjectWithAimsDetailById: (
    projectId: string,
  ) => Promise<ProjectWithAimsDetailDataObject | null>;
  fetchProjectIdByMembershipId: (
    membershipId: string,
  ) => Promise<string | null>;
  fetchProjectIdBySupplementGrantId: (
    supplementGrantId: string,
  ) => Promise<string | null>;
};
