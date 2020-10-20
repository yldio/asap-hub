import React from 'react';
import { Paragraph, LibraryPageBody } from '@asap-hub/react-components';
import { join } from 'path';

import { useResearchOutputs } from '../api';
import { usePaginationParams, usePagination } from '../hooks';

interface LibraryListProps {
  searchQuery?: string;
  filters?: Set<string>;
}

const LibraryList: React.FC<LibraryListProps> = ({
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
    return <Paragraph>Loading...</Paragraph>;
  }
  const researchOutputs = result.data.items.map((output) => ({
    ...output,
    href: join('/library', output.id),
    team: output.team && {
      ...output.team,
      href: join('/network/teams', output.team.id),
    },
  }));
  return (
    <LibraryPageBody
      researchOutputs={researchOutputs}
      numberOfItems={result.data.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    />
  );
};

export default LibraryList;
