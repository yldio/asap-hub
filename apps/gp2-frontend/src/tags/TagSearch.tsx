import { TagSearchPageList } from '@asap-hub/gp2-components';
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
  } = useSearch(['documentType']);

  const filterSet = new Set<string>(filters.documentType);
  const onChangeFilter = (filter: string) => {
    toggleFilter(filter, 'documentType');
  };

  const { currentPage, pageSize } = usePaginationParams();
  const { total } = useTagSearchResults({
    searchQuery: '',
    filters: new Set(),
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
