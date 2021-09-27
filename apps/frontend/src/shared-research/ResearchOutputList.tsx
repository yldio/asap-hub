import { SharedResearchList } from '@asap-hub/react-components';
import { sharedResearch } from '@asap-hub/routing';
import { format } from 'date-fns';

import { useResearchOutputs } from './state';
import { usePaginationParams, usePagination } from '../hooks';
import { useAlgolia } from '../hooks/algolia';
import { getResearchOutputs } from './api';
import { createCsvFileStream, researchOutputToCSV } from './export';

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
  const { index } = useAlgolia();

  const { numberOfPages, renderPageHref } = usePagination(
    result?.total || 0,
    pageSize,
  );
  const exportResults = async () => {
    let morePages = true;
    let page = 0;
    const csvStream = createCsvFileStream(
      { headers: true },
      `SharedOutputs_${format(new Date(), 'MMddyy')}.csv`,
    );
    while (morePages) {
      // We are doing this in chunks and streams to avoid blob/ram limits.
      // eslint-disable-next-line no-await-in-loop
      const data = await getResearchOutputs(index, {
        filters,
        searchQuery,
        currentPage: page,
        pageSize: 10000,
      });
      data.hits.map(researchOutputToCSV).forEach((row) => csvStream.write(row));
      page += 1;
      morePages = page <= data.nbPages - 1;
    }
    csvStream.end();
  };
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
