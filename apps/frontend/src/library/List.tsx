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
  const {
    loading,
    data: researchOutputData = { total: 0, items: [] },
    error,
  } = useResearchOutputs({
    searchQuery,
    filters: [...filters],
    currentPage,
    pageSize,
  });

  const { numberOfPages, renderPageHref } = usePagination(
    researchOutputData.total,
    pageSize,
  );

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }
  if (researchOutputData) {
    const researchOutputs = researchOutputData.items.map((output) => ({
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
        numberOfItems={researchOutputData.total}
        numberOfPages={numberOfPages}
        currentPageIndex={currentPage}
        renderPageHref={renderPageHref}
      />
    );
  }

  return (
    <Paragraph>
      {error.name}
      {': '}
      {error.message}
    </Paragraph>
  );
};

export default LibraryList;
