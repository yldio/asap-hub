import { createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  EmptyState,
  noOutputsIcon,
  OutputCard,
} from '@asap-hub/gp2-components';
import { ResultList, SearchAndFilter } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { useAlgolia } from '../hooks/algolia';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { getOutputs } from './api';
import { outputFields, outputsResponseToStream, outputToCSV } from './export';
import { useOutputs } from './state';

type OutputListProps = {
  projectId?: string;
  workingGroupId?: string;
  authorId?: string;
} & Pick<ComponentProps<typeof SearchAndFilter>, 'filters' | 'searchQuery'>;
const OutputList: React.FC<OutputListProps> = ({
  searchQuery,
  filters = new Set(),
  projectId,
  workingGroupId,
  authorId,
}) => {
  const { currentPage, pageSize } = usePaginationParams();

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
          filters,
          searchQuery,
        }).then((data) => ({ items: data.hits, total: data.nbHits })),
      outputToCSV,
    );

  const { items, total } = useOutputs({
    searchQuery,
    filters,
    currentPage,
    pageSize,
    projectId,
    workingGroupId,
    authorId,
  });
  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  return total || searchQuery ? (
    <ResultList
      icon={noOutputsIcon}
      numberOfItems={total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      exportResults={exportOutputs}
    >
      {items.map((output) => (
        <OutputCard key={output.id} {...output} showTags />
      ))}
    </ResultList>
  ) : (
    <EmptyState
      icon={noOutputsIcon}
      title={'No outputs available.'}
      description={
        'When a working group or project has an associated output, it will be listed here.'
      }
    />
  );
};

export default OutputList;
