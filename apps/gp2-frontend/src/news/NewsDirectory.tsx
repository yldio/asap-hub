import { NewsPageList } from '@asap-hub/gp2-components';
import Frame from '../Frame';
import { useSearch } from '../hooks/search';
import NewsList from './NewsList';

const NewsDirectory = () => {
  const {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
  } = useSearch(['type']);

  const filterSet = new Set<string>(filters.type);
  const onChangeFilter = (filter: string) => {
    toggleFilter(filter, 'type');
  };
  return (
    <NewsPageList
      searchQuery={searchQuery}
      onChangeSearch={setSearchQuery}
      filters={filterSet}
      onChangeFilter={onChangeFilter}
    >
      <Frame title="News List">
        <NewsList searchQuery={debouncedSearchQuery} filters={filterSet} />
      </Frame>
    </NewsPageList>
  );
};

export default NewsDirectory;
