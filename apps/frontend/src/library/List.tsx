import React from 'react';

import { Paragraph, LibraryCard } from '@asap-hub/react-components';

import { useResearchOutputs } from '../api';

const Page: React.FC<{}> = () => {
  const { loading, data: researchOutputData, error } = useResearchOutputs();

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }
  if (researchOutputData) {
    return researchOutputData.map((output) => {
      const { id } = output;
      return (
        <div key={id}>
          <LibraryCard {...output} />
        </div>
      );
    });
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
