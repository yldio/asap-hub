import {
  engagementInitialSortingDirection,
  EngagementSortingDirection,
  SortEngagement,
} from '@asap-hub/model';
import { AnalyticsEngagementPageBody } from '@asap-hub/react-components';
import { useState } from 'react';

import { usePagination, usePaginationParams, useSearch } from '../../hooks';
import { useAnalyticsAlgolia } from '../../hooks/algolia';
import { useAnalyticsEngagement } from './state';

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
