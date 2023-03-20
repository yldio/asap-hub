import { OutputCard } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { ResultList } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
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
  const currentUser = useCurrentUserGP2();
  const isAdministrator = currentUser?.role === 'Administrator';

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
        <OutputCard
          key={output.id}
          {...output}
          isAdministrator={isAdministrator}
        />
      ))}
    </ResultList>
  );
};

export default OutputList;
