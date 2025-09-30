import { FC, useCallback, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { analytics } from '@asap-hub/routing';
import { AnalyticsOpenSciencePageBody } from '@asap-hub/react-components';
import { OSChampionOpensearchResponse } from '@asap-hub/model';
import PreprintCompliance from './PreprintCompliance';
import PublicationCompliance from './PublicationCompliance';
import { useSearch, useAnalytics, useAnalyticsOpensearch } from '../../hooks';

type MetricOption = 'preprint-compliance' | 'publication-compliance';

const OpenScience: FC<Record<string, never>> = () => {
  const history = useHistory();
  const { metric } = useParams<{
    metric: MetricOption;
  }>();

  const setMetric = (newMetric: MetricOption) => {
    history.push(analytics({}).openScience({}).metric({ metric: newMetric }).$);
  };

  const { timeRange } = useAnalytics();
  const { tags, setTags } = useSearch();
  const osChampionClient = useAnalyticsOpensearch<OSChampionOpensearchResponse>(
    'preprint-compliance',
  );

  // TODO: Implement export functionality for Open Science metrics
  const exportResults = () => Promise.resolve();

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const loadTags = useCallback(
    async (tagQuery: string) => {
      // Clear any existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Return a promise that resolves after debounce delay
      return new Promise<Array<{ label: string; value: string }>>((resolve) => {
        debounceTimeoutRef.current = setTimeout(async () => {
          try {
            const response = await osChampionClient.client.getTagSuggestions(
              tagQuery,
              'teams',
            );

            const result = response.map((value) => ({
              label: value,
              value,
            }));
            resolve(result);
          } catch (error) {
            resolve([]);
          }
        }, 500); // 500ms debounce delay
      });
    },
    [osChampionClient.client],
  );

  return (
    <AnalyticsOpenSciencePageBody
      tags={tags}
      setTags={setTags}
      loadTags={loadTags}
      metric={metric}
      setMetric={setMetric}
      exportResults={exportResults}
      timeRange={timeRange}
    >
      {metric === 'preprint-compliance' ? (
        <PreprintCompliance tags={tags} />
      ) : (
        <PublicationCompliance tags={tags} />
      )}
    </AnalyticsOpenSciencePageBody>
  );
};

export default OpenScience;
