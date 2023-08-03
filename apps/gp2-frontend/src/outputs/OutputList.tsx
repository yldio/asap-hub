import { OutputCard } from '@asap-hub/gp2-components';
import { ResultList } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useOutputs } from './state';

interface OutputListProps {
  searchQuery?: string;
  filters?: Set<string>;
  project?: string;
  workingGroup?: string;
  author?: string;
}

const OutputList: React.FC<OutputListProps> = ({
  searchQuery = '',
  filters = new Set(),
  project,
  workingGroup,
  author,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const currentUser = useCurrentUserGP2();
  const isAdministrator = currentUser?.role === 'Administrator';

  const { items, total } = useOutputs({
    searchQuery,
    filters,
    currentPage,
    pageSize,
    project,
    workingGroup,
    author,
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
