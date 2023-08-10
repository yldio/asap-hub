import { Frame } from '@asap-hub/frontend-utils';
import { OutputPageList } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { FC } from 'react';
import { usePaginationParams, useSearch } from '../hooks';

import OutputList from '../outputs/OutputList';
import { useOutputs } from '../outputs/state';

type OutputsProps = {
  workingGroupId: string;
};

const Outputs: FC<OutputsProps> = ({ workingGroupId }) => {
  const {
    filters,
    searchQuery,
    toggleFilter,
    setSearchQuery,
    debouncedSearchQuery,
  } = useSearch<gp2.FetchOutputFilter>(['documentType']);
  const { currentPage, pageSize } = usePaginationParams();
  const { total } = useOutputs({
    searchQuery: '',
    filters: new Set(),
    currentPage,
    pageSize,
    workingGroup: workingGroupId,
  });
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
      hasOutputs={!!total}
    >
      <Frame title="News List">
        <OutputList
          workingGroup={workingGroupId}
          searchQuery={debouncedSearchQuery}
          filters={filterSet}
        />
      </Frame>
    </OutputPageList>
  );
};

export default Outputs;
