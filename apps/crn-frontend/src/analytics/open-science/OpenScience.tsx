import { FC } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { analytics } from '@asap-hub/routing';
import { AnalyticsOpenSciencePageBody } from '@asap-hub/react-components';
import { useSearch, useAnalytics } from '../../hooks';
import { useAnalyticsAlgolia } from '../../hooks/algolia';
import PreprintCompliance from './PreprintCompliance';
import PublicationCompliance from './PublicationCompliance';

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
  const { client } = useAnalyticsAlgolia();

  // TODO: Implement export functionality for Open Science metrics
  const exportResults = () => Promise.resolve();

  const loadTags = async (tagQuery: string) => {
    const searchedTags = await client.searchForTagValues(
      ['engagement'],
      tagQuery,
      {},
    );
    return searchedTags.facetHits.map(({ value }) => ({
      label: value,
      value,
    }));
  };

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
