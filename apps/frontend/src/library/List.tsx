import React from 'react';
import { Paragraph, LibraryPageBody } from '@asap-hub/react-components';
import { join } from 'path';

import { useResearchOutputs } from '../api';

const Page: React.FC<{}> = () => {
  const { loading, data: researchOutputData, error } = useResearchOutputs();

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }
  if (researchOutputData) {
    const researchOutput = researchOutputData.map((output) => ({
      ...output,
      href: join('/library', output.id),
      teamHref: output.team
        ? join('/network/teams', output.team.id)
        : undefined,
    }));
    return <LibraryPageBody researchOutput={researchOutput} />;
  }

  return (
    <Paragraph>
      {error.name}
      {': '}
      {error.message}
    </Paragraph>
  );
};

export default Page;
