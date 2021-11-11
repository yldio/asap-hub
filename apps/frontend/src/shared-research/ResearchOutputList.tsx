import { SharedResearchList } from '@asap-hub/react-components';
import { sharedResearch } from '@asap-hub/routing';
import { format } from 'date-fns';
import { useFlags } from '@asap-hub/react-context';

import { useResearchOutputs } from './state';
import { usePaginationParams, usePagination } from '../hooks';
import { useAlgolia } from '../hooks/algolia';
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
  const { isEnabled } = useFlags();
  const { currentPage, pageSize, isListView, cardViewParams, listViewParams } =
    usePaginationParams();
  const result = useResearchOutputs({
    searchQuery,
    filters,
    currentPage,
    pageSize,
  });
  const { index } = useAlgolia();

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
        getResearchOutputs(index, {
          filters,
          searchQuery,
          ...paginationParams,
        }),
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
      exportResults={
        isEnabled('ALGOLIA_RESEARCH_OUTPUTS') ? exportResults : undefined
      }
      cardViewHref={sharedResearch({}).$ + cardViewParams}
      listViewHref={sharedResearch({}).$ + listViewParams}
    />
  );
};

export default ResearchOutputList;
