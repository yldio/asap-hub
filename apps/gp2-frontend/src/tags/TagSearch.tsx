import { TagSearchPageList } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { FC } from 'react';
import Frame from '../Frame';
import { usePaginationParams } from '../hooks';
import { useSearch } from '../hooks/search';
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
  const { total } = useTagSearchResults({
    searchQuery: '',
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
    >
      <Frame title="Tag Search Results List">
        <ResultList searchQuery={debouncedSearchQuery} filters={filterSet} />
      </Frame>
    </TagSearchPageList>
  );
};

export default TagSearch;
