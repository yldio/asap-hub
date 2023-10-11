import { TutorialsPageBody } from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../../hooks';
import { useTutorials } from './state';

interface TutorialListProps {
  searchQuery: string;
}

const TutorialList: React.FC<TutorialListProps> = ({ searchQuery = '' }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const result = useTutorials({
    searchQuery,
    currentPage,
    pageSize,
    filters: new Set(),
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );

  return (
    <TutorialsPageBody
      tutorials={result.items}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
      currentPage={currentPage}
      numberOfItems={result.total}
    />
  );
};

export default TutorialList;
