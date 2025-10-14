import { FC, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { resultsToStream, createCsvFileStream } from '@asap-hub/frontend-utils';
import { analytics } from '@asap-hub/routing';
import { AnalyticsOpenSciencePageBody } from '@asap-hub/react-components';
import {
  LimitedTimeRangeOption,
  PreprintComplianceOpensearchResponse,
  PreprintComplianceResponse,
  PublicationComplianceOpensearchResponse,
  PublicationComplianceResponse,
} from '@asap-hub/model';
import PreprintCompliance from './PreprintCompliance';
import PublicationCompliance from './PublicationCompliance';
import {
  useSearch,
  useAnalytics,
  useAnalyticsOpensearch,
  usePaginationParams,
} from '../../hooks';
import { getPreprintCompliance, getPublicationCompliance } from './api';
import { preprintComplianceToCSV, publicationComplianceToCSV } from './export';

type MetricOption = 'preprint-compliance' | 'publication-compliance';

const OpenScience: FC<Record<string, never>> = () => {
  const history = useHistory();
  const { metric } = useParams<{
    metric: MetricOption;
  }>();

  const { currentPage } = usePaginationParams();
  const isPreprintCompliancePage = metric === 'preprint-compliance';

  const setMetric = (newMetric: MetricOption) => {
    history.push(analytics({}).openScience({}).metric({ metric: newMetric }).$);
  };

  const { timeRange } = useAnalytics();
  const { tags, setTags } = useSearch();
  const preprintClient =
    useAnalyticsOpensearch<PreprintComplianceOpensearchResponse>(
      'preprint-compliance',
    );
  const publicationClient =
    useAnalyticsOpensearch<PublicationComplianceOpensearchResponse>(
      'publication-compliance',
    );

  const exportResults = useCallback(() => {
    if (isPreprintCompliancePage) {
      return resultsToStream<PreprintComplianceResponse>(
        createCsvFileStream(
          `open_science_${metric}_${format(new Date(), 'MMddyy')}.csv`,
          {
            header: true,
          },
        ),
        (paginationParams) =>
          getPreprintCompliance(preprintClient.client, {
            tags,
            timeRange: timeRange as LimitedTimeRangeOption,
            ...paginationParams,
            sort: 'team_asc',
          }),
        preprintComplianceToCSV,
      );
    }
    return resultsToStream<PublicationComplianceResponse>(
      createCsvFileStream(
        `open_science_${metric}_${format(new Date(), 'MMddyy')}.csv`,
        {
          header: true,
        },
      ),
      (paginationParams) =>
        getPublicationCompliance(publicationClient.client, {
          tags,
          timeRange: timeRange as LimitedTimeRangeOption,
          ...paginationParams,
          sort: 'team_asc',
        }),
      publicationComplianceToCSV,
    );
  }, [
    metric,
    isPreprintCompliancePage,
    preprintClient.client,
    publicationClient.client,
    tags,
    timeRange,
  ]);

  const tagClient = isPreprintCompliancePage
    ? preprintClient.client
    : publicationClient.client;
  const loadTags = useCallback(
    async (tagQuery: string) => {
      const response = await tagClient.getTagSuggestions(tagQuery, 'teams');
      return response.map((value) => ({ label: value, value }));
    },
    [tagClient],
  );

  return (
    <AnalyticsOpenSciencePageBody
      currentPage={currentPage}
      tags={tags}
      setTags={setTags}
      loadTags={loadTags}
      metric={metric}
      setMetric={setMetric}
      exportResults={exportResults}
      timeRange={timeRange}
    >
      {isPreprintCompliancePage ? (
        <PreprintCompliance
          key={`preprint-compliance-${tags.join(
            ',',
          )}-${timeRange}-${currentPage}`}
          tags={tags}
        />
      ) : (
        <PublicationCompliance
          key={`publication-compliance-${tags.join(
            ',',
          )}-${timeRange}-${currentPage}`}
          tags={tags}
        />
      )}
    </AnalyticsOpenSciencePageBody>
  );
};

export default OpenScience;
