import { format } from 'date-fns';
import { useRecoilValue } from 'recoil';
import { SharedResearchList } from '@asap-hub/react-components';
import { sharedResearch } from '@asap-hub/routing';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import { ResearchOutputResponse } from '@asap-hub/model';

import { useResearchOutputs } from './state';
import { usePaginationParams, usePagination } from '../hooks';
import { getResearchOutputsFromCMS } from './api';
import { contentfulResultsToStream, researchOutputToCSV } from './export';
import { authorizationState } from '../auth/state';
import { useAlgolia } from '../hooks/algolia';

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

  const { numberOfPages, renderPageHref } = usePagination(
    result?.total || 0,
    pageSize,
  );
  const authorization = useRecoilValue(authorizationState);

  const { client } = useAlgolia();

  const exportResults = () =>
    contentfulResultsToStream<ResearchOutputResponse>(
      createCsvFileStream(`SharedOutputs_${format(new Date(), 'MMddyy')}.csv`, {
        header: true,
      }),
      (paginationParams) =>
        getResearchOutputsFromCMS(
          client,
          {
            filters,
            searchQuery,
            ...paginationParams,
          },
          authorization,
        ),
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
