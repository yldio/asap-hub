import { createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  engagementInitialSortingDirection,
  EngagementResponse,
  EngagementSortingDirection,
  SortEngagement,
} from '@asap-hub/model';
import { AnalyticsEngagementPageBody } from '@asap-hub/react-components';
import { useState } from 'react';
import { format } from 'date-fns';

import { usePagination, usePaginationParams, useSearch } from '../../hooks';
import { useAnalyticsAlgolia } from '../../hooks/algolia';
import { algoliaResultsToStream } from '../utils/export';
import { useAnalyticsEngagement } from './state';
import { getEngagement } from './api';
import { engagementToCSV } from './export';

const Engagement = () => {
  const { currentPage, pageSize } = usePaginationParams();

  const [sort, setSort] = useState<SortEngagement>('team_asc');
  const [sortingDirection, setSortingDirection] =
    useState<EngagementSortingDirection>(engagementInitialSortingDirection);
  const { client } = useAnalyticsAlgolia();
  const { tags, setTags } = useSearch();

  const { items: data, total } = useAnalyticsEngagement({
    currentPage,
    pageSize,
    sort,
    tags,
    timeRange: '30d',
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  const exportResults = () =>
    algoliaResultsToStream<EngagementResponse>(
      createCsvFileStream(`engagement_${format(new Date(), 'MMddyy')}.csv`, {
        header: true,
      }),
      (paginationParams) =>
        getEngagement(client, {
          tags,
          ...paginationParams,
        }),
      engagementToCSV,
    );

  return (
    <AnalyticsEngagementPageBody
      tags={tags}
      setTags={setTags}
      loadTags={async (tagQuery) => {
        const searchedTags = await client.searchForTagValues(
          ['engagement'],
          tagQuery,
          {},
        );
        return searchedTags.facetHits.map(({ value }) => ({
          label: value,
          value,
        }));
      }}
      data={data}
      exportResults={exportResults}
      sort={sort}
      setSort={setSort}
      sortingDirection={sortingDirection}
      setSortingDirection={setSortingDirection}
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
    />
  );
};
export default Engagement;
