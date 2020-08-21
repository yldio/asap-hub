import React from 'react';
import { useParams } from 'react-router-dom';
import { Paragraph } from '@asap-hub/react-components';

const ResearchOutput: React.FC<{}> = () => {
  const { id } = useParams();
  return <Paragraph>Research output id: {id}</Paragraph>;
};

export default ResearchOutput;
