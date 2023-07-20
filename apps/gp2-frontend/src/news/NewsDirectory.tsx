import { NewsPageList } from '@asap-hub/gp2-components';
import Frame from '../Frame';
import { useSearch } from '../hooks/general-search';
import NewsList from './NewsList';

const NewsDirectory = () => {
  const {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
  } = useSearch();

  return (
    <NewsPageList
      searchQuery={searchQuery}
      onChangeSearch={setSearchQuery}
      filters={filters}
      onChangeFilter={toggleFilter}
    >
      <Frame title="News List">
        <NewsList searchQuery={debouncedSearchQuery} filters={filters} />
      </Frame>
    </NewsPageList>
  );
};

export default NewsDirectory;
