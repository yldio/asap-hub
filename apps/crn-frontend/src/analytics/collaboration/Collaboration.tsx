import { AnalyticsCollaborationPageBody } from '@asap-hub/react-components';
import { analytics } from '@asap-hub/routing';
import { useHistory, useParams } from 'react-router-dom';

import UserCollaboration from './UserCollaboration';
import TeamCollaboration from './TeamCollaboration';
import { useAnalytics, usePaginationParams, useSearch } from '../../hooks';
import { useAnalyticsAlgolia } from '../../hooks/algolia';

const Collaboration = () => {
  const history = useHistory();
  const { metric, type } = useParams<{
    metric: 'user' | 'team';
    type: 'within-team' | 'across-teams';
  }>();
  const { timeRange, documentCategory, outputType } = useAnalytics();
  const { tags, setTags } = useSearch();
  const { client } = useAnalyticsAlgolia();
  const { currentPage } = usePaginationParams();

  const entityType =
    metric === 'user' ? 'user-collaboration' : 'team-collaboration';
  const setMetric = (newMetric: 'user' | 'team') =>
    history.push(
      analytics({})
        .collaboration({})
        .collaborationPath({ metric: newMetric, type }).$,
    );
  const setType = (newType: 'within-team' | 'across-teams') =>
    history.push(
      analytics({})
        .collaboration({})
        .collaborationPath({ metric, type: newType }).$,
    );

  return (
    <AnalyticsCollaborationPageBody
      metric={metric}
      type={type}
      setMetric={setMetric}
      setType={setType}
      timeRange={timeRange}
      outputType={metric === 'team' ? outputType : undefined}
      documentCategory={metric === 'user' ? documentCategory : undefined}
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
      currentPage={currentPage}
    >
      {metric === 'user' ? (
        <UserCollaboration type={type} tags={tags} />
      ) : (
        <TeamCollaboration type={type} tags={tags} />
      )}
    </AnalyticsCollaborationPageBody>
  );
};

export default Collaboration;
