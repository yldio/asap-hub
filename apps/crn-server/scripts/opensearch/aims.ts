/* eslint-disable no-console */
import type { MetricObject } from './types';
import { getAimsMilestonesDataProvider } from '../../src/dependencies/aims-milestones.dependencies';
import type {
  AimWithMilestonesDataObject,
  MilestoneDataObject,
  ProjectWithAimsDetailDataObject,
} from '../../src/data-providers/types';
import { deriveAimStatus } from '../../src/utils/aim-status';
import { extractDOIs, paginate } from './shared-utils';

const PROJECTS_PAGE_SIZE = 50;
const AIMS_PAGE_SIZE = 100;
const MILESTONES_PAGE_SIZE = 50;

const fetchAllProjectsWithAimsDetail = async (
  provider: ReturnType<typeof getAimsMilestonesDataProvider>,
): Promise<ProjectWithAimsDetailDataObject[]> => {
  console.log('Fetching projects with aims detail from Contentful...');
  const projects = await paginate<ProjectWithAimsDetailDataObject>(
    (params) => provider.fetchProjectsWithAimsDetail(params),
    PROJECTS_PAGE_SIZE,
  );
  console.log(`Fetched ${projects.length} projects from Contentful.`);
  return projects;
};

/**
 * Builds a map of aimId → { articleCount, articlesDOI, status } by joining
 * two flat queries: aims→milestone IDs, then milestones→article+status data.
 * This avoids the deep nesting (aims × milestones × articles) that exceeds
 * Contentful's query complexity limit.
 */
const buildAimArticleMap = async (
  provider: ReturnType<typeof getAimsMilestonesDataProvider>,
): Promise<
  Map<string, { articleCount: number; articlesDOI: string; status: string }>
> => {
  console.log('Fetching aims with milestone IDs from Contentful...');
  const [aims, milestones] = await Promise.all([
    paginate<AimWithMilestonesDataObject>(
      (params) => provider.fetchAimsWithMilestones(params),
      AIMS_PAGE_SIZE,
    ),
    (async () => {
      console.log('Fetching milestones with article data from Contentful...');
      return paginate<MilestoneDataObject>(
        (params) => provider.fetchMilestones(params),
        MILESTONES_PAGE_SIZE,
      );
    })(),
  ]);

  // Build a lookup: milestoneId → articles (id + doi) + status
  const milestoneArticleMap = new Map<
    string,
    { articleIds: string[]; articlesDOI: string; status: string | null }
  >();
  milestones.forEach((milestone) => {
    if (!milestone?.sys?.id) return;
    const related = milestone.relatedArticlesCollection;
    const articleIds = (related?.items ?? [])
      .filter((item): item is NonNullable<typeof item> => !!item?.sys?.id)
      .map((item) => item.sys.id);
    milestoneArticleMap.set(milestone.sys.id, {
      articleIds,
      articlesDOI: extractDOIs(related?.items),
      status: milestone.status ?? null,
    });
  });

  // Aggregate per aim: deduplicate articles and derive status from milestones
  const aimArticleMap = new Map<
    string,
    { articleCount: number; articlesDOI: string; status: string }
  >();
  aims.forEach((aim) => {
    if (!aim?.sys?.id) return;
    const linkedMilestones = aim.milestonesCollection?.items ?? [];
    const allArticleIds = new Set<string>();
    const allDois = new Set<string>();
    const linkedMilestoneStatuses: Array<{ status?: string | null }> = [];

    linkedMilestones.forEach((milestone) => {
      if (!milestone?.sys?.id) return;
      const data = milestoneArticleMap.get(milestone.sys.id);
      if (!data) return;
      data.articleIds.forEach((id) => allArticleIds.add(id));
      data.articlesDOI.split(',').forEach((doi) => {
        if (doi) allDois.add(doi);
      });
      linkedMilestoneStatuses.push({ status: data.status });
    });

    aimArticleMap.set(aim.sys.id, {
      articleCount: allArticleIds.size,
      articlesDOI: [...allDois].join(','),
      status: deriveAimStatus(linkedMilestoneStatuses),
    });
  });

  return aimArticleMap;
};

const getTeamName = (project: ProjectWithAimsDetailDataObject): string => {
  const members = project.membersCollection?.items ?? [];
  const teamMember = members.find(
    (m) => m?.projectMember?.__typename === 'Teams',
  );
  return teamMember?.projectMember?.displayName?.trim() ?? '';
};

export const exportAimsData = async (): Promise<
  MetricObject<'project-aims'>[]
> => {
  const provider = getAimsMilestonesDataProvider();

  const [projects, aimArticleMap] = await Promise.all([
    fetchAllProjectsWithAimsDetail(provider),
    buildAimArticleMap(provider),
  ]);

  const documents: MetricObject<'project-aims'>[] = [];

  projects.forEach((project) => {
    const teamName = getTeamName(project);

    const processAimsCollection = (
      aimsCollection: ProjectWithAimsDetailDataObject['originalGrantAimsCollection'],
      grantType: 'original' | 'supplement',
    ) => {
      const aims = aimsCollection?.items ?? [];
      aims.forEach((aim) => {
        if (!aim?.sys?.id) return;
        if (!aim.description?.trim()) {
          console.warn(`Skipping aim ${aim.sys.id} — missing description.`);
          return;
        }

        const { articleCount, articlesDOI, status } = aimArticleMap.get(
          aim.sys.id,
        ) ?? {
          articleCount: 0,
          articlesDOI: '',
          status: 'Pending',
        };

        console.log('PROJECT TITLE:', project.title);
        console.log('PROJECT', project);

        documents.push({
          id: aim.sys.id,
          description: aim.description.trim(),
          grantType,
          projectId: project.sys.id,
          projectName: project.title?.trim() ?? '',
          teamName,
          status,
          articleCount,
          articlesDOI,
          createdDate: aim.sys.firstPublishedAt ?? null,
          lastDate: aim.sys.publishedAt ?? null,
        });
      });
    };

    processAimsCollection(project.originalGrantAimsCollection, 'original');
    processAimsCollection(
      project.supplementGrant?.aimsCollection,
      'supplement',
    );
  });

  console.log(
    `Exported ${documents.length} project-aims documents for OpenSearch.`,
  );

  return documents;
};
