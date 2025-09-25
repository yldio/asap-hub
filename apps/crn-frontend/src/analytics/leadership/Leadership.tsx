import { isEnabled } from '@asap-hub/flags';
import { resultsToStream, createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  AnalyticsTeamLeadershipResponse,
  OSChampionOpensearchResponse,
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

import {
  useSearch,
  useAnalyticsOpensearch,
  useAnalytics,
  usePaginationParams,
} from '../../hooks';
import { getAnalyticsLeadership, getAnalyticsOSChampion } from './api';
import { leadershipToCSV, osChampionToCSV } from './export';
import OSChampion from './OSChampion';
import TeamLeadership from './TeamLeadership';

const Leadership: FC<Record<string, never>> = () => {
  const history = useHistory();
  const { metric } = useParams<{
    metric: MetricOption;
  }>();
  const { currentPage } = usePaginationParams();

  const [osChampionSort, setOsChampionSort] =
    useState<SortOSChampion>('team_asc');
  const [teamSort, setTeamSort] =
    useState<SortLeadershipAndMembership>('team_asc');
  const setMetric = (newMetric: MetricOption) => {
    history.push(analytics({}).leadership({}).metric({ metric: newMetric }).$);
  };

  const { tags, setTags } = useSearch();
  const { timeRange } = useAnalytics();
  const { client } = useAnalyticsAlgolia();
  const osChampionClient =
    useAnalyticsOpensearch<OSChampionOpensearchResponse>('os-champion');
  const isOSChampionPage = metric === 'os-champion';

  const exportTeamLeadership = () =>
    resultsToStream<AnalyticsTeamLeadershipResponse>(
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

  const exportOSChampion = () =>
    resultsToStream<OSChampionOpensearchResponse>(
      createCsvFileStream(
        `leadership_${metric}_${format(new Date(), 'MMddyy')}.csv`,
        {
          header: true,
        },
      ),
      (paginationParams) =>
        getAnalyticsOSChampion(osChampionClient.client, {
          tags,
          timeRange,
          sort: osChampionSort,
          ...paginationParams,
        }),
      osChampionToCSV,
    );

  const exportResults = isOSChampionPage
    ? exportOSChampion
    : exportTeamLeadership;

  const loadTags = async (tagQuery: string) => {
    if (isOSChampionPage) {
      const response =
        await osChampionClient.client.getTagSuggestions(tagQuery);

      return response.map((value) => ({
        label: value,
        value,
      }));
    }
    const searchedTags = await client.searchForTagValues(
      ['team-leadership'],
      tagQuery,
      {},
    );
    return searchedTags.facetHits.map(({ value }) => ({
      label: value,
      value,
    }));
  };

  const isOSChampionEnabled = isEnabled('ANALYTICS_PHASE_TWO');
  return !isOSChampionEnabled && isOSChampionPage ? (
    <Redirect
      to={analytics({}).leadership({}).metric({ metric: 'working-group' }).$}
    />
  ) : (
    <AnalyticsLeadershipPageBody
      isOSChampionEnabled={isOSChampionEnabled}
      tags={tags}
      setTags={setTags}
      loadTags={async (tagQuery) => loadTags(tagQuery)}
      metric={metric}
      setMetric={setMetric}
      exportResults={exportResults}
      timeRange={isOSChampionPage ? timeRange : undefined}
      currentPage={currentPage}
    >
      {isOSChampionPage ? (
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
