import {
  ListResponse,
  OSChampionDataObject,
  PreliminaryDataSharingDataObject,
} from '@asap-hub/model';
import { indexOpensearchData } from '@asap-hub/server-common';
import {
  opensearchUsername,
  opensearchPassword,
  awsRegion,
  environment,
} from '../src/config';
import AnalyticsController from '../src/controllers/analytics.controller';
import { getAnalyticsDataProvider } from '../src/dependencies/analytics.dependencies';

export const PAGE_SIZE = 10;

const validMetrics = ['os-champion', 'preliminary-data-sharing'] as const;

type Metrics = (typeof validMetrics)[number];

type MetricToObjectMap = {
  'os-champion': OSChampionDataObject;
  'preliminary-data-sharing': PreliminaryDataSharingDataObject;
};

type MetricObject<T extends Metrics> = MetricToObjectMap[T];

const metricConfig = {
  'os-champion': {
    indexAlias: 'os-champion',
    mapping: {
      properties: {
        teamId: { type: 'text' },
        teamName: {
          type: 'text',
          analyzer: 'ngram_analyzer',
          search_analyzer: 'ngram_search_analyzer',
          fields: {
            keyword: { type: 'keyword' },
          },
        },
        isTeamInactive: { type: 'boolean' },
        teamAwardsCount: { type: 'integer' },
        users: {
          type: 'nested',
          properties: {
            id: { type: 'text' },
            name: {
              type: 'text',
              analyzer: 'ngram_analyzer',
              search_analyzer: 'ngram_search_analyzer',
              fields: {
                keyword: { type: 'keyword' },
              },
            },
            awardsCount: { type: 'integer' },
          },
        },
      },
    },
  },
  'preliminary-data-sharing': {
    indexAlias: 'preliminary-data-sharing',
    mapping: {
      properties: {
        teamId: { type: 'text' },
        teamName: {
          type: 'text',
          analyzer: 'ngram_analyzer',
          search_analyzer: 'ngram_search_analyzer',
          fields: {
            keyword: { type: 'keyword' },
          },
        },
        isTeamInactive: { type: 'boolean' },
        percentShared: { type: 'integer' },
        limitedData: { type: 'boolean' },
        timeRange: { type: 'text' },
      },
    },
  },
} as const;

export const exportAnalyticsData = async <T extends Metrics>(
  metric: T,
): Promise<MetricObject<T>[]> => {
  const analyticsController = new AnalyticsController(
    getAnalyticsDataProvider(),
  );

  let recordCount = 0;
  let total = 0;
  let records: ListResponse<MetricObject<T>> | null = null;
  let page = 1;
  const documents: MetricObject<T>[] = [];

  const fetchRecords = async () => {
    const options = {
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    };

    switch (metric) {
      case 'os-champion':
        return analyticsController.fetchOSChampion(options) as Promise<
          ListResponse<MetricObject<T>>
        >;
      case 'preliminary-data-sharing':
        const timeRanges = ['all', 'last-year'] as const;
        const allRecords = await Promise.all(
          timeRanges.map(
            (timeRange) =>
              analyticsController.fetchPreliminaryDataSharing({
                ...options,
                filter: { timeRange },
              }) as Promise<ListResponse<MetricObject<T>>>,
          ),
        );

        return {
          total: allRecords.reduce((sum, records) => sum + records.total, 0),
          items: allRecords.flatMap((records) => records.items),
        } as ListResponse<MetricObject<T>>;
      default:
        throw new Error(`Metric ${metric} not supported`);
    }
  };

  do {
    records = await fetchRecords();

    if (records) {
      total = records.total;

      page++;
      recordCount += records.items.length;
      documents.push(...records.items);
    }
  } while (total > recordCount);

  console.log(
    `Finished exporting ${recordCount} records for metric: ${metric}`,
  );
  return documents;
};

const exportMetricToOpensearch = async <T extends Metrics>(metric: T) => {
  console.log(`Starting export for metric: ${metric}`);

  const config = metricConfig[metric];
  if (!config) {
    throw new Error(`Configuration not found for metric: ${metric}`);
  }

  const documents = await exportAnalyticsData(metric);

  await indexOpensearchData({
    awsRegion,
    stage: environment,
    opensearchUsername,
    opensearchPassword,
    indexAlias: config.indexAlias,
    getData: async () => ({
      documents,
      mapping: config.mapping,
    }),
  });

  console.log(
    `Successfully indexed ${documents.length} documents for metric: ${metric}`,
  );
};

const run = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(
      'Usage: yarn workspace @asap-hub/crn-server sync:opensearch <metric1> [metric2] [metric3] ...',
    );
    process.exit(1);
  }

  if (args.includes('all')) {
    console.log('Exporting all metrics');
    await Promise.all(
      validMetrics.map((metric) => exportMetricToOpensearch(metric)),
    );
    process.exit(0);
  } else {
    const metrics = args as Metrics[];

    const invalidMetrics = metrics.filter(
      (metric) => !validMetrics.includes(metric),
    );
    if (invalidMetrics.length > 0) {
      console.error(`Invalid metrics: ${invalidMetrics.join(', ')}`);
      process.exit(1);
    }

    console.log(`Exporting metrics: ${metrics.join(', ')}`);

    for (const metric of metrics) {
      try {
        await exportMetricToOpensearch(metric);
      } catch (error) {
        console.error(`Error exporting metric ${metric}:`, error);
        process.exit(1);
      }
    }
  }

  console.log('All metrics exported successfully!');
};

run();
