import { Client } from '@opensearch-project/opensearch';
import {
  getClient,
  upsertOpensearchDocuments,
  deleteByDocumentIds,
  deleteByFieldValue,
} from '@asap-hub/server-common';
import type {
  AimsMilestonesDataProvider,
  AimWithMilestonesDataObject,
  MilestoneDataObject,
  ProjectWithAimsDetailDataObject,
} from '../../data-providers/types';
import { deriveAimStatus } from '../../utils/aim-status';
import { metricConfig } from '../../../scripts/opensearch/constants';
import {
  awsRegion,
  environment,
  opensearchUsername,
  opensearchPassword,
} from '../../config';
import type {
  ProjectAimsDataObject,
  ProjectMilestonesDataObject,
} from '../../../scripts/opensearch/types';
import { extractDOIs } from '../../../scripts/opensearch/shared-utils';
import logger from '../../utils/logger';

const AIMS_INDEX = metricConfig['project-aims'].indexAlias;
const MILESTONES_INDEX = metricConfig['project-milestones'].indexAlias;

const getTeamName = (project: ProjectWithAimsDetailDataObject): string => {
  const members = project.membersCollection?.items ?? [];
  const teamMember = members.find(
    (m) => m?.projectMember?.__typename === 'Teams',
  );
  return teamMember?.projectMember?.displayName?.trim() ?? '';
};

const getOpensearchClient = (): Promise<Client> =>
  getClient(awsRegion, environment, opensearchUsername, opensearchPassword);

const buildAimDocument = (
  aim: {
    sys: {
      id: string;
      firstPublishedAt?: string | null;
      publishedAt?: string | null;
    };
    description?: string | null;
  },
  project: ProjectWithAimsDetailDataObject,
  grantType: 'original' | 'supplement',
  milestones: MilestoneDataObject[],
  aimMilestoneIds: string[],
): ProjectAimsDataObject | null => {
  if (!aim.description?.trim()) return null;

  const linkedMilestones = milestones.filter((m) =>
    aimMilestoneIds.includes(m.sys.id),
  );

  const allArticleIds = new Set<string>();
  const allDois = new Set<string>();
  const milestoneStatuses: Array<{ status?: string | null }> = [];

  linkedMilestones.forEach((milestone) => {
    milestoneStatuses.push({ status: milestone.status });
    const articles = milestone.relatedArticlesCollection?.items ?? [];
    articles.forEach((article) => {
      if (article?.sys?.id) allArticleIds.add(article.sys.id);
      if (article?.doi?.trim()) allDois.add(article.doi.trim());
    });
  });

  return {
    id: aim.sys.id,
    description: aim.description.trim(),
    grantType,
    projectId: project.sys.id,
    projectName: project.title?.trim() ?? '',
    teamName: getTeamName(project),
    status: deriveAimStatus(milestoneStatuses),
    articleCount: allArticleIds.size,
    articlesDOI: [...allDois].join(','),
    aimOrder: getAimOrder(aim.sys.id, project),
    createdDate: aim.sys.firstPublishedAt ?? null,
    lastDate: aim.sys.publishedAt ?? null,
  };
};

const buildMilestoneDocument = (
  milestone: MilestoneDataObject,
  aimNumbers: number[],
  projectId: string,
  projectName: string,
  grantType: string,
): ProjectMilestonesDataObject => {
  const sorted = [...aimNumbers].sort((a, b) => a - b);
  const related = milestone.relatedArticlesCollection;

  return {
    id: milestone.sys.id,
    description: milestone.description?.trim() ?? '',
    aimNumbersAsc: sorted.join(','),
    aimNumbersDesc: [...sorted].reverse().join(','),
    status: milestone.status ?? '',
    articleCount: related?.total ?? 0,
    articlesDOI: extractDOIs(related?.items),
    projectId,
    projectName,
    grantType,
    createdDate: milestone.sys.firstPublishedAt ?? null,
    lastDate: milestone.sys.publishedAt ?? null,
  };
};

const getAimGrantType = (
  aimId: string,
  project: ProjectWithAimsDetailDataObject,
): 'original' | 'supplement' => {
  const originalAims = project.originalGrantAimsCollection?.items ?? [];
  if (originalAims.some((a) => a?.sys?.id === aimId)) return 'original';
  return 'supplement';
};

const getAimOrder = (
  aimId: string,
  project: ProjectWithAimsDetailDataObject,
): number => {
  const originalAims = project.originalGrantAimsCollection?.items ?? [];
  const originalIdx = originalAims.findIndex((a) => a?.sys?.id === aimId);
  if (originalIdx >= 0) return originalIdx + 1;

  const supplementAims = project.supplementGrant?.aimsCollection?.items ?? [];
  const supplementIdx = supplementAims.findIndex((a) => a?.sys?.id === aimId);
  if (supplementIdx >= 0) return supplementIdx + 1;

  return 0;
};

/**
 * Extracts non-null milestone IDs from an aim's milestonesCollection.
 */
const getMilestoneIdsFromAim = (
  aim: AimWithMilestonesDataObject | null,
): string[] =>
  aim?.milestonesCollection?.items
    ?.filter((m): m is NonNullable<typeof m> => m !== null)
    .map((m) => m.sys.id) ?? [];

/**
 * Collects all milestone IDs for a list of aim IDs.
 */
const collectMilestoneIdsForAims = async (
  provider: AimsMilestonesDataProvider,
  aimIds: string[],
): Promise<string[]> => {
  const milestoneIds: string[] = [];
  for (const aimId of aimIds) {
    const aim = await provider.fetchAimWithMilestonesById(aimId);
    milestoneIds.push(...getMilestoneIdsFromAim(aim));
  }
  return [...new Set(milestoneIds)];
};

type AimDetail = {
  sys: {
    id: string;
    firstPublishedAt?: string | null;
    publishedAt?: string | null;
  };
  description?: string | null;
};

/**
 * Fetches an aim's milestones and builds its OpenSearch document.
 * Returns null when the aim has no description (skipped by buildAimDocument).
 */
const buildAimDocumentForAim = async (
  provider: AimsMilestonesDataProvider,
  aimId: string,
  project: ProjectWithAimsDetailDataObject,
  aimDetail: AimDetail,
  grantType: 'original' | 'supplement',
): Promise<ProjectAimsDataObject | null> => {
  const aimWithMilestones = await provider.fetchAimWithMilestonesById(aimId);
  const milestoneIds = getMilestoneIdsFromAim(aimWithMilestones);

  const milestones = await Promise.all(
    milestoneIds.map((id) => provider.fetchMilestoneById(id)),
  );
  const validMilestones = milestones.filter(
    (m): m is MilestoneDataObject => m !== null,
  );

  return buildAimDocument(
    aimDetail,
    project,
    grantType,
    validMilestones,
    milestoneIds,
  );
};

/**
 * Builds an aim document and upserts it. Returns the document or null if skipped.
 */
const buildAndUpsertAim = async (
  client: Client,
  provider: AimsMilestonesDataProvider,
  aimId: string,
  project: ProjectWithAimsDetailDataObject,
  aimDetail: AimDetail,
  grantType: 'original' | 'supplement',
): Promise<ProjectAimsDataObject | null> => {
  const doc = await buildAimDocumentForAim(
    provider,
    aimId,
    project,
    aimDetail,
    grantType,
  );
  if (!doc) return null;

  await upsertOpensearchDocuments(client, AIMS_INDEX, [doc]);
  return doc;
};

/**
 * Resolves aimNumbers/grantType/project info for a milestone by looking up
 * each aim linked to it, then builds the milestone document.
 */
const buildMilestoneDocumentForMilestone = async (
  provider: AimsMilestonesDataProvider,
  milestone: MilestoneDataObject,
  linkedAimIds: readonly string[],
  fallbackProjectId = '',
  fallbackProjectName = '',
): Promise<ProjectMilestonesDataObject> => {
  let projectId = fallbackProjectId;
  let projectName = fallbackProjectName;
  let grantType = '';
  const aimNumbers: number[] = [];

  for (const aimId of linkedAimIds) {
    const project = await provider.fetchProjectWithAimsDetailByAimId(aimId);
    if (project) {
      projectId = project.sys.id;
      projectName = project.title?.trim() ?? '';
      grantType = getAimGrantType(aimId, project);
      aimNumbers.push(getAimOrder(aimId, project));
    }
  }

  return buildMilestoneDocument(
    milestone,
    aimNumbers,
    projectId,
    projectName,
    grantType,
  );
};

/**
 * Builds a milestone document and upserts it.
 */
const buildAndUpsertMilestone = async (
  client: Client,
  provider: AimsMilestonesDataProvider,
  milestone: MilestoneDataObject,
  linkedAimIds: readonly string[],
  fallbackProjectId?: string,
  fallbackProjectName?: string,
): Promise<void> => {
  const doc = await buildMilestoneDocumentForMilestone(
    provider,
    milestone,
    linkedAimIds,
    fallbackProjectId,
    fallbackProjectName,
  );
  await upsertOpensearchDocuments(client, MILESTONES_INDEX, [doc]);
};

/**
 * Rebuilds and upserts a single milestone document in OpenSearch.
 */
export const reindexMilestoneById = async (
  provider: AimsMilestonesDataProvider,
  milestoneId: string,
): Promise<void> => {
  const [milestone, aimIds] = await Promise.all([
    provider.fetchMilestoneById(milestoneId),
    provider.fetchAimIdsLinkedToMilestone(milestoneId),
  ]);

  if (!milestone) {
    logger.debug(`Milestone ${milestoneId} not found, skipping`);
    return;
  }

  const client = await getOpensearchClient();
  await buildAndUpsertMilestone(client, provider, milestone, aimIds);
};

/**
 * Finds aims linked to a milestone and rebuilds their OpenSearch documents.
 * Used when a milestone changes (its status/articles affect aim status).
 *
 * Note: if the milestone is unpublished (gone from the delivery API),
 * we cannot resolve its linked aims and must rely on the scheduled
 * full reindex to refresh their status/article counts.
 */
export const reindexAimsByMilestoneId = async (
  provider: AimsMilestonesDataProvider,
  milestoneId: string,
): Promise<void> => {
  const aimIds = await provider.fetchAimIdsLinkedToMilestone(milestoneId);
  if (aimIds.length === 0) {
    logger.debug(
      `Milestone ${milestoneId}: no linked aims found, aim refresh deferred to full reindex`,
    );
    return;
  }
  const client = await getOpensearchClient();

  for (const aimId of aimIds) {
    const project = await provider.fetchProjectWithAimsDetailByAimId(aimId);
    const aimDetail = project
      ? project.originalGrantAimsCollection?.items?.find(
          (a) => a?.sys?.id === aimId,
        ) ??
        project.supplementGrant?.aimsCollection?.items?.find(
          (a) => a?.sys?.id === aimId,
        )
      : undefined;

    if (project && aimDetail) {
      const grantType = getAimGrantType(aimId, project);
      await buildAndUpsertAim(
        client,
        provider,
        aimId,
        project,
        aimDetail,
        grantType,
      );
    }
  }
};

/**
 * Finds milestones linked to an aim and rebuilds their OpenSearch documents.
 * Used when an aim changes (aimNumbers in milestone docs may change).
 */
export const reindexMilestonesByAimId = async (
  provider: AimsMilestonesDataProvider,
  aimId: string,
): Promise<void> => {
  const aim = await provider.fetchAimWithMilestonesById(aimId);
  const milestoneIds = getMilestoneIdsFromAim(aim);

  for (const milestoneId of milestoneIds) {
    await reindexMilestoneById(provider, milestoneId);
  }
};

/**
 * Rebuilds all aim and milestone documents for a project.
 * Deletes all existing aims and milestones, then reinserts from Contentful.
 */
export const reindexByProjectId = async (
  provider: AimsMilestonesDataProvider,
  projectId: string,
): Promise<void> => {
  const project = await provider.fetchProjectWithAimsDetailById(projectId);
  if (!project) {
    logger.debug(`Project ${projectId} not found, skipping`);
    return;
  }

  const allAimDetails = [
    ...(project.originalGrantAimsCollection?.items ?? []),
    ...(project.supplementGrant?.aimsCollection?.items ?? []),
  ].filter((a): a is NonNullable<typeof a> => a !== null);

  const aimIds = allAimDetails.map((a) => a.sys.id);

  // Delete ALL existing aims and milestones for this project.
  // Using deleteByProjectId (projectId field, not document IDs) ensures we also
  // remove aims/milestones that were previously linked but have since been
  // unlinked from the project.
  await deleteByProjectId(projectId);

  const client = await getOpensearchClient();
  const milestoneIds = await collectMilestoneIdsForAims(provider, aimIds);

  // Reinsert all aims
  for (const aimDetail of allAimDetails) {
    const grantType = getAimGrantType(aimDetail.sys.id, project);
    await buildAndUpsertAim(
      client,
      provider,
      aimDetail.sys.id,
      project,
      aimDetail,
      grantType,
    );
  }

  // Reinsert all milestones
  for (const milestoneId of milestoneIds) {
    const milestone = await provider.fetchMilestoneById(milestoneId);
    if (milestone) {
      const linkedAimIds =
        await provider.fetchAimIdsLinkedToMilestone(milestoneId);
      await buildAndUpsertMilestone(
        client,
        provider,
        milestone,
        linkedAimIds,
        project.sys.id,
        project.title?.trim() ?? '',
      );
    }
  }
};

/**
 * Deletes a single aim document from OpenSearch.
 */
export const deleteAimById = async (aimId: string): Promise<void> => {
  const client = await getOpensearchClient();
  await deleteByDocumentIds(client, AIMS_INDEX, [aimId]);
};

/**
 * Deletes a single milestone document from OpenSearch.
 */
export const deleteMilestoneById = async (
  milestoneId: string,
): Promise<void> => {
  const client = await getOpensearchClient();
  await deleteByDocumentIds(client, MILESTONES_INDEX, [milestoneId]);
};

/**
 * Deletes all aim and milestone documents for a project.
 * Queries OpenSearch directly by projectId so it works even when
 * the project is no longer available in Contentful (e.g. after unpublish).
 */
export const deleteByProjectId = async (projectId: string): Promise<void> => {
  const client = await getOpensearchClient();
  await deleteByFieldValue(client, AIMS_INDEX, 'projectId', projectId);
  await deleteByFieldValue(client, MILESTONES_INDEX, 'projectId', projectId);
};

/**
 * Refreshes milestones linked to an unpublished aim.
 *
 * Milestones are shared across aims, so we cannot blindly delete them.
 * For each milestone linked to the aim:
 *   - If still linked to other published aims → reindex it (updates aimNumbers)
 *   - If orphaned (no other aims link to it)  → delete it from OpenSearch
 *
 * Note: if the aim is already gone from the delivery API, we cannot resolve
 * its milestone IDs and rely on the scheduled full reindex.
 */
export const deleteMilestonesByAimId = async (
  provider: AimsMilestonesDataProvider,
  aimId: string,
): Promise<void> => {
  const aim = await provider.fetchAimWithMilestonesById(aimId);
  if (!aim) {
    logger.debug(
      `Aim ${aimId} not available in Contentful, milestone cleanup deferred to full reindex`,
    );
    return;
  }

  const milestoneIds = getMilestoneIdsFromAim(aim);

  if (milestoneIds.length === 0) return;

  for (const milestoneId of milestoneIds) {
    const otherAimIds = (
      await provider.fetchAimIdsLinkedToMilestone(milestoneId)
    ).filter((id) => id !== aimId);

    if (otherAimIds.length > 0) {
      // Milestone is shared with other aims — reindex to update aimNumbers
      await reindexMilestoneById(provider, milestoneId);
    } else {
      // No other aims reference this milestone — safe to delete
      await deleteMilestoneById(milestoneId);
    }
  }
};
