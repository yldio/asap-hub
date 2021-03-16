import React from 'react';
import { SharedResearchPageBody, Loading } from '@asap-hub/react-components';

import { useResearchOutputs } from '../api';
import { usePaginationParams, usePagination } from '../hooks';

interface SharedResearchListProps {
  searchQuery?: string;
  filters?: Set<string>;
}

const SharedResearchList: React.FC<SharedResearchListProps> = ({
  searchQuery,
  filters = new Set(),
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const result = useResearchOutputs({
    searchQuery,
    filters: [...filters],
    currentPage,
    pageSize,
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.data?.total ?? 0,
    pageSize,
  );

  if (result.loading) {
    return <Loading />;
  }
  return (
    <SharedResearchPageBody
      researchOutputs={result.data.items}
      numberOfItems={result.data.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    />
  );
};

export default SharedResearchList;
