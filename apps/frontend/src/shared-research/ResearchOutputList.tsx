import { SharedResearchList } from '@asap-hub/react-components';
import { sharedResearch } from '@asap-hub/routing';
import { format } from 'date-fns';
import { useResearchOutputs } from './state';
import { usePaginationParams, usePagination } from '../hooks';
import { INDEX, useAlgolia } from '../hooks/algolia';
import { getResearchOutputs } from './api';
import {
  createCsvFileStream,
  algoliaResultsToStream,
  researchOutputToCSV,
} from './export';

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
    searchIndex: !searchQuery.length ? INDEX['desc(addedDate)'] : INDEX.primary,
  });

  const { client } = useAlgolia();

  const { numberOfPages, renderPageHref } = usePagination(
    result?.total || 0,
    pageSize,
  );
  const exportResults = () =>
    algoliaResultsToStream(
      createCsvFileStream(
        { headers: true },
        `SharedOutputs_${format(new Date(), 'MMddyy')}.csv`,
      ),
      (paginationParams) =>
        getResearchOutputs(
          client.initIndex(
            !searchQuery.length ? INDEX['desc(addedDate)'] : INDEX.primary,
          ),
          {
            filters,
            searchQuery,
            ...paginationParams,
          },
        ),
      researchOutputToCSV,
    );

  return (
    <SharedResearchList
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
