import { OutputPageList } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { FC } from 'react';
import Frame from '../Frame';
import { usePaginationParams } from '../hooks';
import { useSearch } from '../hooks/search';
import OutputList from './OutputList';
import { useOutputs } from './state';

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
  } = useSearch<gp2.FetchOutputFilter>(['documentType']);

  const filterSet = new Set<string>(filters.documentType);
  const onChangeFilter = (filter: string) => {
    toggleFilter(filter, 'documentType');
  };
  const { currentPage, pageSize } = usePaginationParams();
  const { total } = useOutputs({
    searchQuery: '',
    filters: new Set(),
    currentPage,
    pageSize,

    workingGroup: workingGroupId,
    project: projectId,
    author: userId,
  });
  return (
    <OutputPageList
      searchQuery={searchQuery}
      onChangeSearch={setSearchQuery}
      filters={filterSet}
      onChangeFilter={onChangeFilter}
      hasOutputs={!!total}
    >
      <Frame title="News List">
        <OutputList
          searchQuery={debouncedSearchQuery}
          filters={filterSet}
          workingGroup={workingGroupId}
          project={projectId}
          author={userId}
        />
      </Frame>
    </OutputPageList>
  );
};

export default OutputDirectory;
