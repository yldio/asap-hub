import { TagSearchPageList } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { FC } from 'react';
import Frame from '../Frame';
import { usePaginationParams } from '../hooks';
import { useAlgolia } from '../hooks/algolia';
import { useSearch } from '../hooks/search';
import { getItemTypes } from './api';
import ResultList from './ResultList';
import { useTagSearchResults } from './state';

const TagSearch: FC = () => {
  const {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
  } = useSearch(['entityType']);

  const filterSet = new Set<gp2.EntityType>(filters.entityType);
  const onChangeFilter = (filter: string) => {
    toggleFilter(filter, 'entityType');
  };

  const { currentPage, pageSize } = usePaginationParams();

  const { client } = useAlgolia();
  const { tags, setTags } = useSearch();
  const { total } = useTagSearchResults({
    tags,
    entityType: filterSet,
    currentPage,
    pageSize,
  });

  return (
    <TagSearchPageList
      searchQuery={searchQuery}
      onChangeSearch={setSearchQuery}
      filters={filterSet}
      onChangeFilter={onChangeFilter}
      hasResults={!!total}
      tags={tags}
      setTags={setTags}
      loadTags={async (tagQuery) => {
        const searchedTags = await client.searchForTagValues(
          getItemTypes(filters.entityType ? filters.entityType : []),
          tagQuery,
          { tagFilters: tags },
        );
        return searchedTags.facetHits.map(({ value }) => ({
          label: value,
          value,
        }));
      }}
    >
      <Frame title="Tag Search Results List">
        <ResultList searchQuery={debouncedSearchQuery} filters={filterSet} />
      </Frame>
    </TagSearchPageList>
  );
};

export default TagSearch;
