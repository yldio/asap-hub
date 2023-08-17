import { createCsvFileStream } from '@asap-hub/frontend-utils';
import { OutputPageList } from '@asap-hub/gp2-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context/build/auth';
import { gp2 } from '@asap-hub/model';
import { FC } from 'react';
import Frame from '../Frame';
import { usePaginationParams } from '../hooks';
import { useSearch } from '../hooks/search';
import OutputList from './OutputList';
import { getOutputs } from './api';
import { useOutputs } from './state';
import { outputFields, outputsResponseToStream, outputToCSV } from './export';
import { useAlgolia } from '../hooks/algolia';

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
          filters: { ...filterSet },
          projectId,
          workingGroupId,
          searchQuery: '',
          currentPage: paginationParams.take ?? null,
          pageSize: paginationParams.skip ?? null,
        }).then(
          (data): gp2.ListOutputResponse => ({
            total: data.nbHits,
            items: data.hits,
          }),
        ),
      outputToCSV,
    );
  return (
    <OutputPageList
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      filters={filterSet}
      onFiltersClick={onChangeFilter}
      hasOutputs={!!total}
      onExportClick={exportOutputs}
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
