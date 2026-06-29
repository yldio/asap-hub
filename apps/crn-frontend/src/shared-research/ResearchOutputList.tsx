import { format } from 'date-fns';
import {
  FetchResearchOutputsFilter,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { SharedResearchList } from '@asap-hub/react-components';
import { sharedResearch } from '@asap-hub/routing';
import { resultsToStream, createCsvFileStream } from '@asap-hub/frontend-utils';

import { useResearchOutputs } from './state';
import { usePaginationParams, usePagination } from '../hooks';
import { useAlgolia } from '../hooks/algolia';
import { getResearchOutputs } from './api';
import { MAX_ALGOLIA_RESULTS, researchOutputToCSV } from './export';

interface ResearchOutputListProps {
  searchQuery?: string;
  filtersMap?: FetchResearchOutputsFilter;
}

const ResearchOutputList: React.FC<ResearchOutputListProps> = ({
  searchQuery = '',
  filtersMap,
}) => {
  const { currentPage, pageSize, isListView, cardViewParams, listViewParams } =
    usePaginationParams();
  const result = useResearchOutputs({
    searchQuery,
    source: filtersMap?.source,
    documentType: filtersMap?.documentType,
    currentPage,
    pageSize,
  });
  const { client } = useAlgolia();

  const { numberOfPages, renderPageHref } = usePagination(
    result?.total || 0,
    pageSize,
  );
  const exportResults = () =>
    resultsToStream<ResearchOutputResponse>(
      createCsvFileStream(`SharedOutputs_${format(new Date(), 'MMddyy')}.csv`, {
        header: true,
      }),
      (paginationParams) =>
        getResearchOutputs(client, {
          source: filtersMap?.source,
          documentType: filtersMap?.documentType,
          searchQuery,
          ...paginationParams,
        }).then((response) => ({
          items: response.hits,
          total: response.nbHits ?? 0,
          algoliaIndexName: response.index,
          algoliaQueryId: response.queryID,
        })),
      researchOutputToCSV,
      MAX_ALGOLIA_RESULTS,
    );

  return (
    <SharedResearchList
      showTags
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
