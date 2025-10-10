import { ListResponse, timeRanges, documentCategories } from '@asap-hub/model';
import { indexOpensearchData } from '@asap-hub/server-common';

import {
  awsRegion,
  environment,
  opensearchPassword,
  opensearchUsername,
} from '../../src/config';
import AnalyticsController from '../../src/controllers/analytics.controller';
import { getAnalyticsDataProvider } from '../../src/dependencies/analytics.dependencies';
import { metricConfig, PAGE_SIZE, validMetrics } from './constants';
import { exportPreprintComplianceData } from './preprint-compliance';
import { exportPublicationComplianceData } from './publication-compliance';
import type { MetricObject, Metrics } from './types';

export const exportAnalyticsData = async <T extends Metrics>(
  metric: T,
): Promise<MetricObject<T>[]> => {
  if (metric === 'preprint-compliance') {
    return exportPreprintComplianceData() as Promise<MetricObject<T>[]>;
  }

  if (metric === 'publication-compliance') {
    return exportPublicationComplianceData() as Promise<MetricObject<T>[]>;
  }

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
        const osChampionRecords = await Promise.all(
          timeRanges.map(
            (timeRange) =>
              analyticsController.fetchOSChampion({
                ...options,
                filter: { timeRange },
              }) as Promise<ListResponse<MetricObject<T>>>,
          ),
        );
        return {
          total: osChampionRecords.reduce(
            (sum, records) => sum + records.total,
            0,
          ),
          items: osChampionRecords.flatMap((records) => records.items),
        } as ListResponse<MetricObject<T>>;
      case 'preliminary-data-sharing':
        const preliminaryDataSharingTimeRanges = ['all', 'last-year'] as const;
        const preliminaryDataSharingRecords = await Promise.all(
          preliminaryDataSharingTimeRanges.map(
            (timeRange) =>
              analyticsController.fetchPreliminaryDataSharing({
                ...options,
                filter: { timeRange },
              }) as Promise<ListResponse<MetricObject<T>>>,
          ),
        );

        return {
          total: preliminaryDataSharingRecords.reduce(
            (sum, records) => sum + records.total,
            0,
          ),
          items: preliminaryDataSharingRecords.flatMap(
            (records) => records.items,
          ),
        } as ListResponse<MetricObject<T>>;
      case 'attendance':
        const attendanceTimeRanges = ['all', 'last-year'] as const;
        const attendanceRecords = await Promise.all(
          attendanceTimeRanges.map(
            (timeRange) =>
              analyticsController.fetchAttendance({
                ...options,
                filter: { timeRange },
              }) as Promise<ListResponse<MetricObject<T>>>,
          ),
        );

        return {
          total: attendanceRecords.reduce(
            (sum, records) => sum + records.total,
            0,
          ),
          items: attendanceRecords.flatMap((records) => records.items),
        } as ListResponse<MetricObject<T>>;

      case 'user-productivity':
        const userProductivityRecords = await Promise.all(
          timeRanges.map((timeRange) =>
            Promise.all(
              documentCategories.map(
                (documentCategory) =>
                  analyticsController.fetchUserProductivity({
                    ...options,
                    filter: { timeRange, documentCategory },
                  }) as Promise<ListResponse<MetricObject<T>>>,
              ),
            ),
          ),
        );

        // Flatten and enrich the data with metadata, keeping all fields
        const enrichedUserProductivityItems = userProductivityRecords.flatMap(
          (timeRangeRecords, timeRangeIndex) =>
            timeRangeRecords.flatMap(
              (documentCategoryRecords, documentCategoryIndex) =>
                documentCategoryRecords.items.map((item) => ({
                  ...item,
                  timeRange: timeRanges[timeRangeIndex],
                  documentCategory: documentCategories[documentCategoryIndex],
                })),
            ),
        );

        return {
          total: userProductivityRecords.reduce(
            (sum, timeRangeRecords) =>
              sum +
              timeRangeRecords.reduce(
                (timeRangeSum, documentCategoryRecords) =>
                  timeRangeSum + documentCategoryRecords.total,
                0,
              ),
            0,
          ),
          items: enrichedUserProductivityItems,
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
