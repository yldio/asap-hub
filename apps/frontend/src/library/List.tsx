import React from 'react';
import { Paragraph, LibraryPageBody } from '@asap-hub/react-components';
import { join } from 'path';

import { useResearchOutputs } from '../api';

interface LibraryListProps {
  searchQuery?: string;
  filters?: Set<string>;
}

const LibraryList: React.FC<LibraryListProps> = ({
  searchQuery,
  filters = new Set(),
}) => {
  const result = useResearchOutputs({
    searchQuery,
    filters: [...filters],
  });

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
      numberOfItems={researchOutputs.length}
      numberOfPages={1}
      currentPageIndex={0}
      renderPageHref={() => ''}
    />
  );
};

export default LibraryList;
