import { TagsPage, TagsPageBody } from '@asap-hub/react-components';
import { usePagination, usePaginationParams, useSearch } from '../hooks';
import { useAlgolia } from '../hooks/algolia';
import { useResearchOutputs } from '../shared-research/state';

const Tags: React.FC<Record<string, never>> = () => {
  const { tags, setTags, searchQuery, filters } = useSearch();
  const { currentPage, pageSize } = usePaginationParams();
  const { numberOfPages, renderPageHref } = usePagination(0, pageSize);
  const { client } = useAlgolia();
  const { items, total } = useResearchOutputs({
    searchQuery,
    filters,
    currentPage,
    pageSize,
    noResultsWithoutCriteria: true,
    tags,
  });
  return (
    <TagsPage
      tags={tags}
      setTags={setTags}
      loadTags={async (tagQuery) => {
        const searchedTags = await client.searchForTagValues(
          ['research-output'],
          tagQuery,
          { tagFilters: tags },
        );
        return searchedTags.facetHits.map(({ value }) => ({
          label: value,
          value,
        }));
      }}
    >
      <TagsPageBody
        currentPage={currentPage}
        numberOfItems={total}
        numberOfPages={numberOfPages}
        renderPageHref={renderPageHref}
        results={items}
      />
    </TagsPage>
  );
};

export default Tags;
