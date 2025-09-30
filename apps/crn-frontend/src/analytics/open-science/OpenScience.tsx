import { FC, useCallback, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { analytics } from '@asap-hub/routing';
import { AnalyticsOpenSciencePageBody } from '@asap-hub/react-components';
import { OSChampionOpensearchResponse } from '@asap-hub/model';
import PreprintCompliance from './PreprintCompliance';
import PublicationCompliance from './PublicationCompliance';
import {
  useSearch,
  useAnalytics,
  useAnalyticsOpensearch,
  usePaginationParams,
} from '../../hooks';

type MetricOption = 'preprint-compliance' | 'publication-compliance';

const OpenScience: FC<Record<string, never>> = () => {
  const history = useHistory();
  const { metric } = useParams<{
    metric: MetricOption;
  }>();

  const { currentPage } = usePaginationParams();

  const setMetric = (newMetric: MetricOption) => {
    history.push(analytics({}).openScience({}).metric({ metric: newMetric }).$);
  };

  const { timeRange } = useAnalytics();
  const { tags, setTags } = useSearch();
  const osClient = useAnalyticsOpensearch<OSChampionOpensearchResponse>(metric);

  // TODO: Implement export functionality for Open Science metrics
  const exportResults = () => Promise.resolve();

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const loadTags = useCallback(
    async (tagQuery: string) => {
      const response = await osClient.client.getTagSuggestions(
        tagQuery,
        'teams',
      );
      return response.map((value) => ({ label: value, value }));
    },
    [osClient.client],
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
      {metric === 'preprint-compliance' ? (
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
