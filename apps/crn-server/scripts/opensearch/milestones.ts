/* eslint-disable no-console */
import type { MetricObject } from './types';
import { getAimsMilestonesDataProvider } from '../../src/dependencies/aims-milestones.dependencies';
import type {
  AimWithMilestonesDataObject,
  MilestoneDataObject,
  ProjectWithAimsDataObject,
} from '../../src/data-providers/types';

const PROJECTS_PAGE_SIZE = 50;
const AIMS_PAGE_SIZE = 100;
const MILESTONES_PAGE_SIZE = 50;

type PagedResult<T> = {
  total?: number;
  items: T[];
};

const paginate = async <T>(
  fetchPage: (params: {
    limit: number;
    skip: number;
  }) => Promise<PagedResult<T>>,
  pageSize: number,
): Promise<T[]> => {
  const results: T[] = [];
  let skip = 0;
  let total = 0;

  do {
    const { total: pageTotal, items } = await fetchPage({
      limit: pageSize,
      skip,
    });
    total = pageTotal ?? 0;
    results.push(...items);
    skip += pageSize;
  } while (skip < total);

  if (results.length === 0) {
    console.warn('paginate: no results returned for query.');
  }

  return results;
};

const buildAimOrderMap = async (): Promise<Map<string, number>> => {
  const provider = getAimsMilestonesDataProvider();
  const aimOrderMap = new Map<string, number>();

  console.log('Building aim order map from projects...');

  const projects = await paginate<ProjectWithAimsDataObject>(
    (params) => provider.fetchProjectsWithAims(params),
    PROJECTS_PAGE_SIZE,
  );

  projects.forEach((project) => {
    const handleAimsCollection = (
      aimsCollection: ProjectWithAimsDataObject['originalGrantAimsCollection'],
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
          aimOrderMap.set(aim.sys.id, index + 1);
        }
      });
    };

    handleAimsCollection(project.originalGrantAimsCollection);
    handleAimsCollection(project.supplementGrant?.aimsCollection);
  });

  console.log(`Aim order map built for ${aimOrderMap.size} aims.`);
  return aimOrderMap;
};

const buildMilestoneToAimNumbersMap = async (
  aimOrderMap: Map<string, number>,
): Promise<Map<string, number[]>> => {
  const milestoneToAimNumberSets = new Map<string, Set<number>>();

  console.log('Building milestone to aim numbers map from aims...');

  const provider = getAimsMilestonesDataProvider();
  const aims = await paginate<AimWithMilestonesDataObject>(
    (params) => provider.fetchAimsWithMilestones(params),
    AIMS_PAGE_SIZE,
  );

  aims.forEach((aim) => {
    const order = aimOrderMap.get(aim.sys.id);
    if (!order) return;

    const milestones = aim.milestonesCollection?.items ?? [];
    milestones.forEach((milestone) => {
      if (!milestone?.sys?.id) return;
      const existing =
        milestoneToAimNumberSets.get(milestone.sys.id) ?? new Set<number>();
      existing.add(order);
      milestoneToAimNumberSets.set(milestone.sys.id, existing);
    });
  });

  const milestoneToAimNumbers = new Map<string, number[]>();
  milestoneToAimNumberSets.forEach((orderSet, milestoneId) => {
    milestoneToAimNumbers.set(
      milestoneId,
      [...orderSet].sort((a, b) => a - b),
    );
  });

  console.log(
    `Milestone to aim numbers map built for ${milestoneToAimNumbers.size} milestones.`,
  );
  return milestoneToAimNumbers;
};

const fetchAllMilestones = async (): Promise<MilestoneDataObject[]> => {
  const provider = getAimsMilestonesDataProvider();
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
  const [aimOrderMap, milestones] = await Promise.all([
    buildAimOrderMap(),
    fetchAllMilestones(),
  ]);
  const milestoneToAimNumbers =
    await buildMilestoneToAimNumbersMap(aimOrderMap);

  if (aimOrderMap.size === 0) {
    console.warn(
      'Aim order map is empty. Aim numbers for milestones will be empty strings.',
    );
  }

  const documents: MetricObject<'project-milestones'>[] = milestones.map(
    (milestone) => {
      const milestoneId = milestone.sys.id;
      const aimNumbers = milestoneToAimNumbers.get(milestoneId);
      const { aimNumbersAsc, aimNumbersDesc } =
        buildAimNumbersStrings(aimNumbers);

      const related = milestone.relatedArticlesCollection;
      const articleCount = related?.total ?? 0;

      const articlesDOISet = new Set<string>();
      related?.items?.forEach((item) => {
        const doi = item?.doi?.trim();
        if (doi) {
          articlesDOISet.add(doi);
        }
      });

      return {
        id: milestoneId,
        description: milestone.description?.trim() ?? '',
        aimNumbersAsc,
        aimNumbersDesc,
        status: milestone.status ?? '',
        articleCount,
        articlesDOI: [...articlesDOISet].join(','),
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
