/* eslint-disable no-console */
import type { MetricObject } from './types';
import { getAimsMilestonesDataProvider } from '../../src/dependencies/aims-milestones.dependencies';
import type {
  AimWithMilestonesDataObject,
  MilestoneDataObject,
  ProjectWithAimsDataObject,
} from '../../src/data-providers/types';
import { extractDOIs, paginate } from './shared-utils';

const PROJECTS_PAGE_SIZE = 50;
const AIMS_PAGE_SIZE = 100;
const MILESTONES_PAGE_SIZE = 50;

type AimMeta = { order: number; projectId: string; grantType: 'original' | 'supplement' };

const buildAimOrderMap = async (
  provider: ReturnType<typeof getAimsMilestonesDataProvider>,
): Promise<Map<string, AimMeta>> => {
  const aimOrderMap = new Map<string, AimMeta>();

  console.log('Building aim order map from projects...');

  const projects = await paginate<ProjectWithAimsDataObject>(
    (params) => provider.fetchProjectsWithAims(params),
    PROJECTS_PAGE_SIZE,
  );

  projects.forEach((project) => {
    const projectId = project.sys.id;

    const handleAimsCollection = (
      aimsCollection: ProjectWithAimsDataObject['originalGrantAimsCollection'],
      grantType: 'original' | 'supplement',
    ) => {
      const aims = aimsCollection?.items ?? [];
      aims.forEach((aim, index) => {
        if (!aim?.sys?.id) return;
        if (!aim.description?.trim()) {
          console.warn(`Skipping aim ${aim.sys.id} — missing description.`);
          return;
        }

        // Only set if not already present to keep the first-seen order
        if (!aimOrderMap.has(aim.sys.id)) {
          aimOrderMap.set(aim.sys.id, { order: index + 1, projectId, grantType });
        }
      });
    };

    handleAimsCollection(project.originalGrantAimsCollection, 'original');
    handleAimsCollection(project.supplementGrant?.aimsCollection, 'supplement');
  });

  console.log(`Aim order map built for ${aimOrderMap.size} aims.`);
  return aimOrderMap;
};

type MilestoneMeta = {
  aimNumbers: number[];
  projectId: string;
  grantType: string;
};

const buildMilestoneMetaMap = async (
  provider: ReturnType<typeof getAimsMilestonesDataProvider>,
  aimOrderMap: Map<string, AimMeta>,
): Promise<Map<string, MilestoneMeta>> => {
  const milestoneAccumulator = new Map<
    string,
    { aimNumbers: Set<number>; projectId: string; grantType: string }
  >();

  console.log('Building milestone meta map from aims...');

  const aims = await paginate<AimWithMilestonesDataObject>(
    (params) => provider.fetchAimsWithMilestones(params),
    AIMS_PAGE_SIZE,
  );

  aims.forEach((aim) => {
    const meta = aimOrderMap.get(aim.sys.id);
    if (!meta) return;

    const milestones = aim.milestonesCollection?.items ?? [];
    milestones.forEach((milestone) => {
      if (!milestone?.sys?.id) return;
      const milestoneId = milestone.sys.id;

      const acc = milestoneAccumulator.get(milestoneId) ?? {
        aimNumbers: new Set<number>(),
        projectId: meta.projectId,
        grantType: meta.grantType,
      };
      acc.aimNumbers.add(meta.order);
      milestoneAccumulator.set(milestoneId, acc);
    });
  });

  const milestoneMetaMap = new Map<string, MilestoneMeta>();
  milestoneAccumulator.forEach((acc, milestoneId) => {
    milestoneMetaMap.set(milestoneId, {
      aimNumbers: [...acc.aimNumbers].sort((a, b) => a - b),
      projectId: acc.projectId,
      grantType: acc.grantType,
    });
  });

  console.log(`Milestone meta map built for ${milestoneMetaMap.size} milestones.`);
  return milestoneMetaMap;
};

const fetchAllMilestones = async (
  provider: ReturnType<typeof getAimsMilestonesDataProvider>,
): Promise<MilestoneDataObject[]> => {
  console.log('Fetching milestones from Contentful...');

  const milestones = await paginate<MilestoneDataObject>(
    (params) => provider.fetchMilestones(params),
    MILESTONES_PAGE_SIZE,
  );

  console.log(`Fetched ${milestones.length} milestones from Contentful.`);
  return milestones;
};

const buildAimNumbersStrings = (numbers: number[] | undefined) => {
  if (!numbers || numbers.length === 0) {
    return { aimNumbersAsc: '', aimNumbersDesc: '' };
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const aimNumbersAsc = sorted.join(',');
  const aimNumbersDesc = [...sorted].reverse().join(',');

  return { aimNumbersAsc, aimNumbersDesc };
};

export const exportMilestonesData = async (): Promise<
  MetricObject<'project-milestones'>[]
> => {
  const provider = getAimsMilestonesDataProvider();

  const [aimOrderMap, milestones] = await Promise.all([
    buildAimOrderMap(provider),
    fetchAllMilestones(provider),
  ]);
  const milestoneMetaMap = await buildMilestoneMetaMap(provider, aimOrderMap);

  if (aimOrderMap.size === 0) {
    console.warn(
      'Aim order map is empty. Aim numbers for milestones will be empty strings.',
    );
  }

  const documents: MetricObject<'project-milestones'>[] = milestones.map(
    (milestone) => {
      const milestoneId = milestone.sys.id;
      const meta = milestoneMetaMap.get(milestoneId);
      const { aimNumbersAsc, aimNumbersDesc } = buildAimNumbersStrings(
        meta?.aimNumbers,
      );

      const related = milestone.relatedArticlesCollection;
      const articleCount = related?.total ?? 0;

      return {
        id: milestoneId,
        description: milestone.description?.trim() ?? '',
        aimNumbersAsc,
        aimNumbersDesc,
        status: milestone.status ?? '',
        articleCount,
        articlesDOI: extractDOIs(related?.items),
        projectId: meta?.projectId ?? '',
        grantType: meta?.grantType ?? '',
        createdDate: milestone.sys.firstPublishedAt ?? null,
        lastDate: milestone.sys.publishedAt ?? null,
      };
    },
  );

  console.log(
    `Exported ${documents.length} project-milestones documents for OpenSearch.`,
  );

  return documents;
};
