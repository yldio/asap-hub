import React from 'react';
import { SharedResearchPageBody } from '@asap-hub/react-components';

import { useResearchOutputs } from './state';
import { usePaginationParams, usePagination } from '../hooks';

interface SharedResearchListProps {
  searchQuery?: string;
  filters?: Set<string>;
}

const SharedResearchList: React.FC<SharedResearchListProps> = ({
  searchQuery = '',
  filters = new Set(),
}) => {
  const {
    currentPage,
    pageSize,
    isListView,
    cardViewParams,
    listViewParams,
  } = usePaginationParams();
  const result = useResearchOutputs({
    searchQuery,
    filters,
    currentPage,
    pageSize,
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );
  return (
    <SharedResearchPageBody
      researchOutputs={result.items}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      isListView={isListView}
      cardViewParams={cardViewParams}
      listViewParams={listViewParams}
    />
  );
};

export default SharedResearchList;
