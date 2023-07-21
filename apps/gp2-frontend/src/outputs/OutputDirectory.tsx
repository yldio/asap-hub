import { OutputsPageList } from '@asap-hub/gp2-components';
import Frame from '../Frame';
import { useSearch } from '../hooks/search';
// import OutputList from './OutputList';

const OutputDirectory = () => {
  // use general search that is being built for news filter
  const {
    filters,
    searchQuery,
    setSearchQuery,
    // debouncedSearchQuery,
    updateFilters,
  } = useSearch();

  return (
    <OutputsPageList
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      updateFilters={updateFilters}
      filters={filters}
    >
      <Frame title="Output List">
        {/* <OutputList searchQuery={debouncedSearchQuery} filters={filters} /> */}
      </Frame>
    </OutputsPageList>
  );
};

export default OutputDirectory;
