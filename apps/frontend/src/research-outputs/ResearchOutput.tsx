import React from 'react';
import { useParams } from 'react-router-dom';
import { ResearchOutputPage, Paragraph } from '@asap-hub/react-components';
import { useResearchOutputById } from '../api';

const ResearchOutput: React.FC<{}> = () => {
  const { id } = useParams();
  const { loading, data: output, error } = useResearchOutputById(id);

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (output) {
    return <ResearchOutputPage {...output} />;
  }

  return (
    <Paragraph>
      {error.name}
      {': '}
      {error.message}
    </Paragraph>
  );
};
export default ResearchOutput;
