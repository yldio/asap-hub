import { OutputPageList } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import Frame from '../Frame';
import { useSearch } from '../hooks/search';
import OutputList from './OutputList';

const OutputDirectory = () => {
  const {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
  } = useSearch<gp2.FetchOutputFilter>(['documentType']);

  const filterSet = new Set<string>(filters.documentType);
  const onChangeFilter = (filter: string) => {
    toggleFilter(filter, 'documentType');
  };
  return (
    <OutputPageList
      searchQuery={searchQuery}
      onChangeSearch={setSearchQuery}
      filters={filterSet}
      onChangeFilter={onChangeFilter}
    >
      <Frame title="News List">
        <OutputList searchQuery={debouncedSearchQuery} filters={filterSet} />
      </Frame>
    </OutputPageList>
  );
};

export default OutputDirectory;
