import {
  EmptyState,
  noOutputsIcon,
  OutputCard,
} from '@asap-hub/gp2-components';
import {
  ResultList as ResultListComponent,
  SearchAndFilter,
} from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { ComponentProps } from 'react';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useOutputs } from '../outputs/state';

type ResultListProps = {
  projectId?: string;
  workingGroupId?: string;
  authorId?: string;
} & Pick<ComponentProps<typeof SearchAndFilter>, 'filters' | 'searchQuery'>;
const ResultList: React.FC<ResultListProps> = ({
  searchQuery,
  filters = new Set(),
  projectId,
  workingGroupId,
  authorId,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const currentUser = useCurrentUserGP2();
  const isAdministrator = currentUser?.role === 'Administrator';

  const { items, total } = useOutputs({
    searchQuery,
    filters,
    currentPage,
    pageSize,
    projectId,
    workingGroupId,
    authorId,
  });
  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  return total || searchQuery ? (
    <ResultListComponent
      icon={noOutputsIcon}
      numberOfItems={total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      isAdministrator={isAdministrator}
    >
      {items.map((output) => (
        <OutputCard
          key={output.id}
          {...output}
          isAdministrator={isAdministrator}
        />
      ))}
    </ResultListComponent>
  ) : (
    <EmptyState
      icon={noOutputsIcon}
      title={'No outputs available.'}
      description={
        'When a working group or project has an associated output, it will be listed here.'
      }
    />
  );
};

export default ResultList;
