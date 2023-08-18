import { createCsvFileStream } from '@asap-hub/frontend-utils';
import { OutputPageList } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { FC, useState } from 'react';
import Frame from '../Frame';
import { usePaginationParams } from '../hooks';
import { useAlgolia } from '../hooks/algolia';
import { useSearch } from '../hooks/search';
import { getOutputs } from './api';
import { outputFields, outputsResponseToStream, outputToCSV } from './export';
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
  const currentUser = useCurrentUserGP2();
  const isAdministrator = currentUser?.role === 'Administrator';

  const filterSet = new Set<string>(filters.documentType);
  const onChangeFilter = (filter: string) => {
    toggleFilter(filter, 'documentType');
  };

  const onFiltersClick = () => setShowFilters(!showFilters);

  const [showFilters, setShowFilters] = useState(false);
  const { currentPage, pageSize } = usePaginationParams();
  const { total } = useOutputs({
    searchQuery: '',
    filters: new Set(),
    currentPage,
    pageSize,
    workingGroupId,
    projectId,
    authorId: userId,
  });
  const { client } = useAlgolia();

  const exportOutputs = () =>
    outputsResponseToStream(
      createCsvFileStream('output_export.csv', {
        columns: outputFields,
        header: true,
      }),
      (paginationParams) =>
        getOutputs(client, {
          ...paginationParams,
          filters: filterSet,
          currentPage,
          pageSize,
          searchQuery,
        }).then((data) => ({ items: data.hits, total: data.nbHits })),
      outputToCSV,
    );
  return (
    <OutputPageList
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      onExportClick={exportOutputs}
      filters={filterSet}
      onFiltersClick={onFiltersClick}
      onChangeFilter={onChangeFilter}
      hasOutputs={!!total}
      isAdministrator={isAdministrator}
    >
      <Frame title="Outputs List">
        <OutputList
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
