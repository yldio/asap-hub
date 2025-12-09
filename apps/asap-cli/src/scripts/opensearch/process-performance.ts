/* eslint-disable no-console, no-underscore-dangle */
import {
  PerformanceMetrics,
  timeRanges,
  documentCategories,
  outputTypes,
} from '@asap-hub/model';
import { getClient, indexOpensearchData } from '@asap-hub/server-common';
import { getPerformanceMetrics } from '../shared/performance-utils';
import {
  userProductivityPerformanceMapping,
  teamProductivityPerformanceMapping,
  userCollaborationPerformanceMapping,
} from './mappings';

interface UserProductivityDocument {
  asapOutput: number;
  asapPublicOutput: number;
  ratio: number;
  timeRange: string;
  documentCategory: string;
}

interface UserProductivityHit {
  _source?: {
    asapOutput?: number;
    asapPublicOutput?: number;
    ratio?: number;
    timeRange?: string;
    documentCategory?: string;
  };
}

interface UserProductivityPerformanceDocument {
  asapOutput: PerformanceMetrics;
  asapPublicOutput: PerformanceMetrics;
  ratio: PerformanceMetrics;
  timeRange: string;
  documentCategory: string;
}

interface TeamProductivityDocument {
  Article: number;
  Bioinformatics: number;
  Dataset: number;
  'Lab Material': number;
  Protocol: number;
  timeRange: string;
  outputType: string;
}

interface TeamProductivityHit {
  _source?: {
    Article?: number;
    Bioinformatics?: number;
    Dataset?: number;
    'Lab Material'?: number;
    Protocol?: number;
    timeRange?: string;
    outputType?: string;
  };
}

interface TeamProductivityPerformanceDocument {
  article: PerformanceMetrics;
  bioinformatics: PerformanceMetrics;
  dataset: PerformanceMetrics;
  labMaterial: PerformanceMetrics;
  protocol: PerformanceMetrics;
  timeRange: string;
  outputType: string;
}

interface UserCollaborationDocument {
  teams: Array<{
    outputsCoAuthoredWithinTeam: number;
    outputsCoAuthoredAcrossTeams: number;
  }>;
  timeRange: string;
  documentCategory: string;
}

interface UserCollaborationHit {
  _source?: {
    teams?: Array<{
      outputsCoAuthoredWithinTeam?: number;
      outputsCoAuthoredAcrossTeams?: number;
    }>;
    timeRange?: string;
    documentCategory?: string;
  };
}

interface UserCollaborationPerformanceDocument {
  withinTeam: PerformanceMetrics;
  acrossTeam: PerformanceMetrics;
  timeRange: string;
  documentCategory: string;
}

export interface ProcessPerformanceOptions {
  awsRegion: string;
  environment: string;
  opensearchUsername: string;
  opensearchPassword: string;
  metric:
    | 'all'
    | 'user-productivity'
    | 'team-productivity'
    | 'user-collaboration';
}

const USER_PRODUCTIVITY_INDEX = 'user-productivity';
const TEAM_PRODUCTIVITY_INDEX = 'team-productivity';
const USER_COLLABORATION_INDEX = 'user-collaboration';
const MAX_RESULTS = 10000;

/**
 * Maps a search hit to a UserProductivityDocument
 */
const mapUserHitToDocument = (
  hit: UserProductivityHit,
): UserProductivityDocument => ({
  asapOutput: hit._source?.asapOutput ?? 0,
  asapPublicOutput: hit._source?.asapPublicOutput ?? 0,
  ratio: hit._source?.ratio ?? 0,
  timeRange: hit._source?.timeRange ?? '',
  documentCategory: hit._source?.documentCategory ?? '',
});

/**
 * Retrieves all user documents for a given time range and document category
 */
const getAllUserDocuments = async (
  client: Awaited<ReturnType<typeof getClient>>,
  timeRange: string,
  documentCategory: string,
): Promise<UserProductivityDocument[]> => {
  try {
    const response = await client.search({
      index: USER_PRODUCTIVITY_INDEX,
      body: {
        query: {
          bool: {
            must: [{ term: { timeRange } }, { term: { documentCategory } }],
          },
        },
        size: MAX_RESULTS,
      },
    });

    const hits = response.body.hits?.hits || [];
    return hits.map(mapUserHitToDocument);
  } catch (error) {
    console.error('Failed to retrieve documents', {
      error,
      timeRange,
      documentCategory,
    });
    throw error;
  }
};

/**
 * Processes user performance metrics for a single time range and document category combination
 */
const processUserMetricsForCombination = async (
  client: Awaited<ReturnType<typeof getClient>>,
  timeRange: string,
  documentCategory: string,
): Promise<UserProductivityPerformanceDocument> => {
  console.info(
    `Processing user performance metrics for ${timeRange}/${documentCategory}`,
  );

  const documents = await getAllUserDocuments(
    client,
    timeRange,
    documentCategory,
  );

  const asapOutputMetrics = getPerformanceMetrics(
    documents.map((doc) => doc.asapOutput),
    true,
  );

  const asapPublicOutputMetrics = getPerformanceMetrics(
    documents.map((doc) => doc.asapPublicOutput),
    true,
  );

  const ratioMetrics = getPerformanceMetrics(
    documents.map((doc) => doc.ratio),
    false,
  );

  console.info(
    `Processed user performance metrics for ${timeRange}/${documentCategory} (${documents.length} users)`,
  );

  return {
    asapOutput: asapOutputMetrics,
    asapPublicOutput: asapPublicOutputMetrics,
    ratio: ratioMetrics,
    timeRange,
    documentCategory,
  };
};

/**
 * Processes user productivity performance metrics for all time ranges and document categories
 */
export const processUserProductivityPerformance = async (
  client: Awaited<ReturnType<typeof getClient>>,
): Promise<UserProductivityPerformanceDocument[]> => {
  // Create all combinations
  const combinations = timeRanges.flatMap((timeRange) =>
    documentCategories.map((documentCategory) => ({
      timeRange,
      documentCategory,
    })),
  );

  // Process all combinations concurrently
  const results = await Promise.allSettled(
    combinations.map(({ timeRange, documentCategory }) =>
      processUserMetricsForCombination(client, timeRange, documentCategory),
    ),
  );

  // Filter out failures and log them
  const performanceDocuments: UserProductivityPerformanceDocument[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      performanceDocuments.push(result.value);
    } else {
      const { timeRange, documentCategory } = combinations[index];
      console.error(
        `Failed to process user productivity performance metrics for ${timeRange}/${documentCategory}`,
        { error: result.reason },
      );
    }
  });

  return performanceDocuments;
};

/**
 * Maps a search hit to a TeamProductivityDocument
 */
const mapTeamHitToDocument = (
  hit: TeamProductivityHit,
): TeamProductivityDocument => ({
  Article: hit._source?.Article ?? 0,
  Bioinformatics: hit._source?.Bioinformatics ?? 0,
  Dataset: hit._source?.Dataset ?? 0,
  'Lab Material': hit._source?.['Lab Material'] ?? 0,
  Protocol: hit._source?.Protocol ?? 0,
  timeRange: hit._source?.timeRange ?? '',
  outputType: hit._source?.outputType ?? '',
});

/**
 * Retrieves all team documents for a given time range and output type
 */
const getAllTeamDocuments = async (
  client: Awaited<ReturnType<typeof getClient>>,
  timeRange: string,
  outputType: string,
): Promise<TeamProductivityDocument[]> => {
  try {
    const response = await client.search({
      index: TEAM_PRODUCTIVITY_INDEX,
      body: {
        query: {
          bool: {
            must: [{ term: { timeRange } }, { term: { outputType } }],
          },
        },
        size: MAX_RESULTS,
      },
    });

    const hits = response.body.hits?.hits || [];
    return hits.map(mapTeamHitToDocument);
  } catch (error) {
    console.error('Failed to retrieve team documents', {
      error,
      timeRange,
      outputType,
    });
    throw error;
  }
};

/**
 * Processes team performance metrics for a single time range and output type combination
 */
const processTeamMetricsForCombination = async (
  client: Awaited<ReturnType<typeof getClient>>,
  timeRange: string,
  outputType: string,
): Promise<TeamProductivityPerformanceDocument> => {
  console.info(
    `Processing team performance metrics for ${timeRange}/${outputType}`,
  );

  const documents = await getAllTeamDocuments(client, timeRange, outputType);

  const articleMetrics = getPerformanceMetrics(
    documents.map((doc) => doc.Article),
    true,
  );

  const bioinformaticsMetrics = getPerformanceMetrics(
    documents.map((doc) => doc.Bioinformatics),
    true,
  );

  const datasetMetrics = getPerformanceMetrics(
    documents.map((doc) => doc.Dataset),
    true,
  );

  const labMaterialMetrics = getPerformanceMetrics(
    documents.map((doc) => doc['Lab Material']),
    true,
  );

  const protocolMetrics = getPerformanceMetrics(
    documents.map((doc) => doc.Protocol),
    true,
  );

  console.info(
    `Processed team performance metrics for ${timeRange}/${outputType} (${documents.length} teams)`,
  );

  return {
    article: articleMetrics,
    bioinformatics: bioinformaticsMetrics,
    dataset: datasetMetrics,
    labMaterial: labMaterialMetrics,
    protocol: protocolMetrics,
    timeRange,
    outputType,
  };
};

/**
 * Processes team productivity performance metrics for all time ranges and output types
 */
export const processTeamProductivityPerformance = async (
  client: Awaited<ReturnType<typeof getClient>>,
): Promise<TeamProductivityPerformanceDocument[]> => {
  const combinations = timeRanges.flatMap((timeRange) =>
    outputTypes.map((outputType) => ({
      timeRange,
      outputType,
    })),
  );

  const results = await Promise.allSettled(
    combinations.map(({ timeRange, outputType }) =>
      processTeamMetricsForCombination(client, timeRange, outputType),
    ),
  );

  const performanceDocuments: TeamProductivityPerformanceDocument[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      performanceDocuments.push(result.value);
    } else {
      const { timeRange, outputType } = combinations[index];
      console.error(
        `Failed to process team productivity performance metrics for ${timeRange}/${outputType}`,
        { error: result.reason },
      );
    }
  });

  return performanceDocuments;
};

/**
 * Maps a search hit to a UserCollaborationDocument
 */
const mapUserCollaborationHitToDocument = (
  hit: UserCollaborationHit,
): UserCollaborationDocument => ({
  teams:
    hit._source?.teams?.map((team) => ({
      outputsCoAuthoredWithinTeam: team.outputsCoAuthoredWithinTeam ?? 0,
      outputsCoAuthoredAcrossTeams: team.outputsCoAuthoredAcrossTeams ?? 0,
    })) || [],
  timeRange: hit._source?.timeRange ?? '',
  documentCategory: hit._source?.documentCategory ?? '',
});

/**
 * Retrieves all user collaboration documents for a given time range and document category
 */
const getAllUserCollaborationDocuments = async (
  client: Awaited<ReturnType<typeof getClient>>,
  timeRange: string,
  documentCategory: string,
): Promise<UserCollaborationDocument[]> => {
  try {
    const response = await client.search({
      index: USER_COLLABORATION_INDEX,
      body: {
        query: {
          bool: {
            must: [{ term: { timeRange } }, { term: { documentCategory } }],
          },
        },
        size: MAX_RESULTS,
      },
    });

    const hits = response.body.hits?.hits || [];
    return hits.map(mapUserCollaborationHitToDocument);
  } catch (error) {
    console.error('Failed to retrieve user collaboration documents', {
      error,
      timeRange,
      documentCategory,
    });
    throw error;
  }
};

/**
 * Processes user collaboration performance metrics for a single time range and document category combination
 */
const processUserCollaborationMetricsForCombination = async (
  client: Awaited<ReturnType<typeof getClient>>,
  timeRange: string,
  documentCategory: string,
): Promise<UserCollaborationPerformanceDocument> => {
  console.info(
    `Processing user collaboration performance metrics for ${timeRange}/${documentCategory}`,
  );

  const documents = await getAllUserCollaborationDocuments(
    client,
    timeRange,
    documentCategory,
  );

  // Flatten all teams from all users
  const flatTeams = documents.flatMap((doc) => doc.teams);

  const withinTeamMetrics = getPerformanceMetrics(
    flatTeams.map((team) => team.outputsCoAuthoredWithinTeam),
    true,
  );

  const acrossTeamMetrics = getPerformanceMetrics(
    flatTeams.map((team) => team.outputsCoAuthoredAcrossTeams),
    true,
  );

  console.info(
    `Processed user collaboration performance metrics for ${timeRange}/${documentCategory} (${documents.length} users, ${flatTeams.length} team memberships)`,
  );

  return {
    withinTeam: withinTeamMetrics,
    acrossTeam: acrossTeamMetrics,
    timeRange,
    documentCategory,
  };
};

/**
 * Processes user collaboration performance metrics for all time ranges and document categories
 */
export const processUserCollaborationPerformance = async (
  client: Awaited<ReturnType<typeof getClient>>,
): Promise<UserCollaborationPerformanceDocument[]> => {
  // Create all combinations
  const combinations = timeRanges.flatMap((timeRange) =>
    documentCategories.map((documentCategory) => ({
      timeRange,
      documentCategory,
    })),
  );

  // Process all combinations concurrently
  const results = await Promise.allSettled(
    combinations.map(({ timeRange, documentCategory }) =>
      processUserCollaborationMetricsForCombination(
        client,
        timeRange,
        documentCategory,
      ),
    ),
  );

  // Filter out failures and log them
  const performanceDocuments: UserCollaborationPerformanceDocument[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      performanceDocuments.push(result.value);
    } else {
      const { timeRange, documentCategory } = combinations[index];
      console.error(
        `Failed to process user collaboration performance metrics for ${timeRange}/${documentCategory}`,
        { error: result.reason },
      );
    }
  });

  return performanceDocuments;
};

/**
 * Main entry point for processing productivity performance metrics
 */
export const processPerformance = async ({
  awsRegion,
  environment,
  opensearchUsername,
  opensearchPassword,
  metric,
}: ProcessPerformanceOptions): Promise<void> => {
  if (metric === 'all' || metric === 'user-productivity') {
    try {
      console.info('Processing user-productivity-performance...');

      await indexOpensearchData<UserProductivityPerformanceDocument>({
        awsRegion,
        stage: environment,
        opensearchUsername,
        opensearchPassword,
        indexAlias: 'user-productivity-performance',
        getData: async () => {
          const client = await getClient(
            awsRegion,
            environment,
            opensearchUsername,
            opensearchPassword,
          );

          const documents = await processUserProductivityPerformance(client);

          return {
            documents,
            mapping: userProductivityPerformanceMapping,
          };
        },
      });

      console.info('Successfully indexed user-productivity-performance data');
    } catch (error) {
      console.error('Failed to process user-productivity-performance', {
        error,
      });
      throw error;
    }
  }

  if (metric === 'all' || metric === 'team-productivity') {
    try {
      console.info('Processing team-productivity-performance...');

      await indexOpensearchData<TeamProductivityPerformanceDocument>({
        awsRegion,
        stage: environment,
        opensearchUsername,
        opensearchPassword,
        indexAlias: 'team-productivity-performance',
        getData: async () => {
          const client = await getClient(
            awsRegion,
            environment,
            opensearchUsername,
            opensearchPassword,
          );

          const documents = await processTeamProductivityPerformance(client);

          return {
            documents,
            mapping: teamProductivityPerformanceMapping,
          };
        },
      });

      console.info('Successfully indexed team-productivity-performance data');
    } catch (error) {
      console.error('Failed to process team-productivity-performance', {
        error,
      });
      throw error;
    }
  }

  if (metric === 'all' || metric === 'user-collaboration') {
    try {
      console.info('Processing user-collaboration-performance...');

      await indexOpensearchData<UserCollaborationPerformanceDocument>({
        awsRegion,
        stage: environment,
        opensearchUsername,
        opensearchPassword,
        indexAlias: 'user-collaboration-performance',
        getData: async () => {
          const client = await getClient(
            awsRegion,
            environment,
            opensearchUsername,
            opensearchPassword,
          );

          const documents = await processUserCollaborationPerformance(client);

          return {
            documents,
            mapping: userCollaborationPerformanceMapping,
          };
        },
      });

      console.info('Successfully indexed user-collaboration-performance data');
    } catch (error) {
      console.error('Failed to process user-collaboration-performance', {
        error,
      });
      throw error;
    }
  }
};
