import { OutputCard } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { ResultList } from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useOutputs } from './state';

interface OutputListProps {
  searchQuery?: string;
  filters?: gp2.FetchOutputFilter;
}

const OutputList: React.FC<OutputListProps> = ({
  searchQuery = '',
  filters,
}) => {
  const { currentPage, pageSize } = usePaginationParams();

  const { items, total } = useOutputs({
    search: searchQuery,
    filter: filters,
    skip: currentPage * pageSize,
    take: pageSize,
  });
  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  return (
    <ResultList
      numberOfItems={total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    >
      {items.map((output) => (
        <OutputCard key={output.id} {...output} />
      ))}
    </ResultList>
  );
};

export default OutputList;
