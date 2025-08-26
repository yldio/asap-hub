import { isEnabled } from '@asap-hub/flags';
import {
  algoliaResultsToStream,
  createCsvFileStream,
} from '@asap-hub/frontend-utils';
import {
  AnalyticsTeamLeadershipResponse,
  SortLeadershipAndMembership,
  SortOSChampion,
} from '@asap-hub/model';
import {
  AnalyticsLeadershipPageBody,
  MetricOption,
} from '@asap-hub/react-components';
import { analytics } from '@asap-hub/routing';
import { format } from 'date-fns';
import { FC, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useAnalyticsAlgolia } from '../../hooks/algolia';

import { useSearch } from '../../hooks';
import { getAnalyticsLeadership } from './api';
import { leadershipToCSV } from './export';
import OSChampion from './OSChampion';
import TeamLeadership from './TeamLeadership';

const Leadership: FC<Record<string, never>> = () => {
  const history = useHistory();
  const { metric } = useParams<{
    metric: MetricOption;
  }>();

  const [osChampionSort, setOsChampionSort] =
    useState<SortOSChampion>('team_asc');
  const [teamSort, setTeamSort] =
    useState<SortLeadershipAndMembership>('team_asc');
  const setMetric = (newMetric: MetricOption) => {
    history.push(analytics({}).leadership({}).metric({ metric: newMetric }).$);
  };

  const { tags, setTags } = useSearch();
  const { client } = useAnalyticsAlgolia();

  const exportResults = () =>
    algoliaResultsToStream<AnalyticsTeamLeadershipResponse>(
      createCsvFileStream(
        `leadership_${metric}_${format(new Date(), 'MMddyy')}.csv`,
        {
          header: true,
        },
      ),
      (paginationParams) =>
        getAnalyticsLeadership(client, {
          metric,
          tags,
          ...paginationParams,
        }),
      leadershipToCSV(metric),
    );

  const isOSChampionEnabled = isEnabled('ANALYTICS_PHASE_TWO');
  return !isOSChampionEnabled && metric === 'os-champion' ? (
    <Redirect
      to={analytics({}).leadership({}).metric({ metric: 'working-group' }).$}
    />
  ) : (
    <AnalyticsLeadershipPageBody
      isOSChampionEnabled={isOSChampionEnabled}
      tags={tags}
      setTags={setTags}
      loadTags={async (tagQuery) => {
        const searchedTags = await client.searchForTagValues(
          ['team-leadership'],
          tagQuery,
          {},
        );
        return searchedTags.facetHits.map(({ value }) => ({
          label: value,
          value,
        }));
      }}
      metric={metric}
      setMetric={setMetric}
      exportResults={exportResults}
    >
      {metric === 'os-champion' ? (
        <OSChampion
          tags={tags}
          sort={osChampionSort}
          setSort={setOsChampionSort}
        />
      ) : (
        <TeamLeadership
          tags={tags}
          sort={teamSort}
          setSort={setTeamSort}
          metric={metric}
        />
      )}
    </AnalyticsLeadershipPageBody>
  );
};

export default Leadership;
