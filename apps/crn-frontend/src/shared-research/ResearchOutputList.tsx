import { format } from 'date-fns';
import { SharedResearchList } from '@asap-hub/react-components';
import { sharedResearch } from '@asap-hub/routing';
import { RESEARCH_OUTPUT_ENTITY_TYPE } from '@asap-hub/algolia';
import { createCsvFileStream } from '@asap-hub/frontend-utils';

import { useResearchOutputs } from './state';
import { usePaginationParams, usePagination } from '../hooks';
import { useAlgolia } from '../hooks/algolia';
import { getResearchOutputs } from './api';
import { algoliaResultsToStream, researchOutputToCSV } from './export';

interface ResearchOutputListProps {
  searchQuery?: string;
  filters?: Set<string>;
}

const ResearchOutputList: React.FC<ResearchOutputListProps> = ({
  searchQuery = '',
  filters = new Set(),
}) => {
  const { currentPage, pageSize, isListView, cardViewParams, listViewParams } =
    usePaginationParams();
  const result = useResearchOutputs({
    searchQuery,
    filters,
    currentPage,
    pageSize,
  });
  const { client } = useAlgolia();

  const { numberOfPages, renderPageHref } = usePagination(
    result?.total || 0,
    pageSize,
  );
  const exportResults = () =>
    algoliaResultsToStream<typeof RESEARCH_OUTPUT_ENTITY_TYPE>(
      createCsvFileStream(`SharedOutputs_${format(new Date(), 'MMddyy')}.csv`, {
        header: true,
      }),
      (paginationParams) =>
        getResearchOutputs(client, {
          filters,
          searchQuery,
          ...paginationParams,
        }),
      researchOutputToCSV,
    );

  return (
    <SharedResearchList
      algoliaIndexName={result.algoliaIndexName}
      algoliaQueryId={result.algoliaQueryId}
      researchOutputs={result.items}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      isListView={isListView}
      exportResults={exportResults}
      cardViewHref={sharedResearch({}).$ + cardViewParams}
      listViewHref={sharedResearch({}).$ + listViewParams}
    />
  );
};

export default ResearchOutputList;
