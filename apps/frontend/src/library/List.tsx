import React from 'react';
import { Paragraph, LibraryPageBody } from '@asap-hub/react-components';
import { join } from 'path';

import { useResearchOutputs } from '../api';

interface LibraryListProps {
  searchQuery?: string;
  filters: Set<string>;
}

const LibraryList: React.FC<LibraryListProps> = ({ searchQuery, filters }) => {
  const { loading, data: researchOutputData, error } = useResearchOutputs({
    searchQuery,
    filters: [...filters],
  });

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
        numberOfItems={researchOutputs.length}
        numberOfPages={1}
        currentPageIndex={0}
        renderPageHref={() => ''}
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
