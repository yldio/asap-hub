import {
  EmptyState,
  noOutputsIcon,
  OutputCard,
} from '@asap-hub/gp2-components';
import { ResultList, SearchAndFilter } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { ComponentProps } from 'react';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useOutputs } from './state';

type OutputListProps = {
  project?: string;
  workingGroup?: string;
  author?: string;
} & Pick<ComponentProps<typeof SearchAndFilter>, 'filters' | 'searchQuery'>;
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
  return total || searchQuery ? (
    <ResultList
      icon={noOutputsIcon}
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

export default OutputList;
