import React from 'react';

import { Paragraph, LibraryPageBody } from '@asap-hub/react-components';

import { useResearchOutputs } from '../api';

const Page: React.FC<{}> = () => {
  const { loading, data: researchOutputData, error } = useResearchOutputs();

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }
  if (researchOutputData) {
    return <LibraryPageBody researchOutput={researchOutputData} />;
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
