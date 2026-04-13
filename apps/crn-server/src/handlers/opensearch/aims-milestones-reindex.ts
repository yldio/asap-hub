import { Client } from '@opensearch-project/opensearch';
import {
  getClient,
  upsertOpensearchDocuments,
  deleteByDocumentIds,
  deleteByFieldValue,
} from '@asap-hub/server-common';
import type {
  AimsMilestonesDataProvider,
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
 * Collects all milestone IDs for a list of aim IDs.
 */
const collectMilestoneIdsForAims = async (
  provider: AimsMilestonesDataProvider,
  aimIds: string[],
): Promise<string[]> => {
  const milestoneIds: string[] = [];
  for (const aimId of aimIds) {
    const aim = await provider.fetchAimWithMilestonesById(aimId);
    const ids =
      aim?.milestonesCollection?.items
        ?.filter((m): m is NonNullable<typeof m> => m !== null)
        .map((m) => m.sys.id) ?? [];
    milestoneIds.push(...ids);
  }
  return [...new Set(milestoneIds)];
};

/**
 * Builds an aim document and upserts it. Returns the document or null if skipped.
 */
const buildAndUpsertAim = async (
  client: Client,
  provider: AimsMilestonesDataProvider,
  aimId: string,
  project: ProjectWithAimsDetailDataObject,
  aimDetail: {
    sys: {
      id: string;
      firstPublishedAt?: string | null;
      publishedAt?: string | null;
    };
    description?: string | null;
  },
  grantType: 'original' | 'supplement',
): Promise<ProjectAimsDataObject | null> => {
  const aimWithMilestones = await provider.fetchAimWithMilestonesById(aimId);
  const milestoneIds =
    aimWithMilestones?.milestonesCollection?.items
      ?.filter((m): m is NonNullable<typeof m> => m !== null)
      .map((m) => m.sys.id) ?? [];

  const milestones = await Promise.all(
    milestoneIds.map((id) => provider.fetchMilestoneById(id)),
  );
  const validMilestones = milestones.filter(
    (m): m is MilestoneDataObject => m !== null,
  );

  const doc = buildAimDocument(
    aimDetail,
    project,
    grantType,
    validMilestones,
    milestoneIds,
  );
  if (!doc) return null;

  await upsertOpensearchDocuments(client, AIMS_INDEX, [doc]);
  return doc;
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

  let projectId = '';
  let projectName = '';
  let grantType = '';
  const aimNumbers: number[] = [];

  for (const aimId of aimIds) {
    const project = await provider.fetchProjectWithAimsDetailByAimId(aimId);
    if (project) {
      projectId = project.sys.id;
      projectName = project.title?.trim() ?? '';
      grantType = getAimGrantType(aimId, project);
      aimNumbers.push(getAimOrder(aimId, project));
    }
  }

  const doc = buildMilestoneDocument(
    milestone,
    aimNumbers,
    projectId,
    projectName,
    grantType,
  );

  const client = await getOpensearchClient();
  await upsertOpensearchDocuments(client, MILESTONES_INDEX, [doc]);
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
    const [project, aimWithMilestones] = await Promise.all([
      provider.fetchProjectWithAimsDetailByAimId(aimId),
      provider.fetchAimWithMilestonesById(aimId),
    ]);

    if (project && aimWithMilestones) {
      const grantType = getAimGrantType(aimId, project);
      const aimDetail =
        project.originalGrantAimsCollection?.items?.find(
          (a) => a?.sys?.id === aimId,
        ) ??
        project.supplementGrant?.aimsCollection?.items?.find(
          (a) => a?.sys?.id === aimId,
        );

      if (aimDetail) {
        const msIds =
          aimWithMilestones.milestonesCollection?.items
            ?.filter((m): m is NonNullable<typeof m> => m !== null)
            .map((m) => m.sys.id) ?? [];

        const milestones = await Promise.all(
          msIds.map((id) => provider.fetchMilestoneById(id)),
        );
        const validMilestones = milestones.filter(
          (m): m is MilestoneDataObject => m !== null,
        );

        const doc = buildAimDocument(
          aimDetail,
          project,
          grantType,
          validMilestones,
          msIds,
        );
        if (doc) {
          await upsertOpensearchDocuments(client, AIMS_INDEX, [doc]);
        }
      }
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
  const milestoneIds =
    aim?.milestonesCollection?.items
      ?.filter((m): m is NonNullable<typeof m> => m !== null)
      .map((m) => m.sys.id) ?? [];

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

  const client = await getOpensearchClient();

  // Delete all existing aims for this project
  if (aimIds.length > 0) {
    await deleteByDocumentIds(client, AIMS_INDEX, aimIds);
  }

  // Delete all existing milestones for these aims
  const milestoneIds = await collectMilestoneIdsForAims(provider, aimIds);
  if (milestoneIds.length > 0) {
    await deleteByDocumentIds(client, MILESTONES_INDEX, milestoneIds);
  }

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
      const aimNumbers: number[] = [];
      let msGrantType = '';

      for (const linkedAimId of linkedAimIds) {
        const linkedProject =
          await provider.fetchProjectWithAimsDetailByAimId(linkedAimId);
        if (linkedProject) {
          msGrantType = getAimGrantType(linkedAimId, linkedProject);
          aimNumbers.push(getAimOrder(linkedAimId, linkedProject));
        }
      }

      const doc = buildMilestoneDocument(
        milestone,
        aimNumbers,
        project.sys.id,
        project.title?.trim() ?? '',
        msGrantType,
      );
      await upsertOpensearchDocuments(client, MILESTONES_INDEX, [doc]);
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

  const milestoneIds =
    aim.milestonesCollection?.items
      ?.filter((m): m is NonNullable<typeof m> => m !== null)
      .map((m) => m.sys.id) ?? [];

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
