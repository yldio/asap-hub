import { ResultList } from '@asap-hub/react-components';
import { OutputCard } from '@asap-hub/gp2-components';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useOutputs } from './state';

interface OutputListProps {
  searchQuery?: string;
  filters?: Set<string>;
}

const OutputList: React.FC<OutputListProps> = ({
  searchQuery = '',
  filters = new Set(),
}) => {
  const { currentPage, pageSize } = usePaginationParams();

  const { items, total } = useOutputs({
    searchQuery,
    filters,
    currentPage,
    pageSize,
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
