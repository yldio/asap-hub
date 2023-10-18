import { OutputPageList } from '@asap-hub/gp2-components';
import { FC } from 'react';
import Frame from '../Frame';
import { usePaginationParams } from '../hooks';
import { useSearch } from '../hooks/search';
import ResultList from './ResultList';
import { useTagSearchResults } from './state';

type OutputDirectoryProps = {
  projectId?: string;
  userId?: string;
  workingGroupId?: string;
};
const OutputDirectory: FC<OutputDirectoryProps> = ({
  projectId,
  workingGroupId,
  userId,
}) => {
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
    workingGroupId,
    projectId,
    authorId: userId,
  });

  return (
    <OutputPageList
      searchQuery={searchQuery}
      onChangeSearch={setSearchQuery}
      filters={filterSet}
      onChangeFilter={onChangeFilter}
      hasOutputs={!!total}
    >
      <Frame title="Outputs List">
        <ResultList
          searchQuery={debouncedSearchQuery}
          filters={filterSet}
          workingGroupId={workingGroupId}
          projectId={projectId}
          authorId={userId}
        />
      </Frame>
    </OutputPageList>
  );
};

export default OutputDirectory;
