import { TagsPageBody } from '@asap-hub/react-components';
import { usePagination, usePaginationParams, useSearch } from '../hooks';
import { useResearchOutputs } from '../shared-research/state';

const Tags: React.FC<Record<string, never>> = () => {
  const { tags, searchQuery, filters } = useSearch();
  const { currentPage, pageSize } = usePaginationParams();
  const { items, total } = useResearchOutputs({
    searchQuery,
    filters,
    currentPage,
    pageSize,
    noResultsWithoutCriteria: true,
    tags,
  });
  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  return (
    <TagsPageBody
      currentPage={currentPage}
      numberOfItems={total}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
      results={items}
    />
  );
};

export default Tags;
