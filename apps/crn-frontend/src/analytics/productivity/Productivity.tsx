import { AnalyticsProductivityPageBody } from '@asap-hub/react-components';
import { analytics } from '@asap-hub/routing';
import { useHistory, useParams } from 'react-router-dom';
import { useAnalytics, usePaginationParams, useSearch } from '../../hooks';
import { useAnalyticsAlgolia } from '../../hooks/algolia';

import TeamProductivity from './TeamProductivity';
import UserProductivity from './UserProductivity';

const Productivity = () => {
  const history = useHistory();
  const { currentPage } = usePaginationParams();

  const { metric } = useParams<{ metric: 'user' | 'team' }>();
  const setMetric = (newMetric: 'user' | 'team') =>
    history.push(
      analytics({}).productivity({}).metric({ metric: newMetric }).$,
    );

  const { timeRange } = useAnalytics();
  const { tags, setTags } = useSearch();
  const { client } = useAnalyticsAlgolia();

  const entityType =
    metric === 'user' ? 'user-productivity' : 'team-productivity';

  return (
    <AnalyticsProductivityPageBody
      metric={metric}
      setMetric={setMetric}
      timeRange={timeRange}
      currentPage={currentPage}
      tags={tags}
      setTags={setTags}
      loadTags={async (tagQuery) => {
        const searchedTags = await client.searchForTagValues(
          [entityType],
          tagQuery,
          {},
        );
        return searchedTags.facetHits.map(({ value }) => ({
          label: value,
          value,
        }));
      }}
    >
      {metric === 'user' ? (
        <UserProductivity tags={tags} />
      ) : (
        <TeamProductivity tags={tags} />
      )}
    </AnalyticsProductivityPageBody>
  );
};

export default Productivity;
