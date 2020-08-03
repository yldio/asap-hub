import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Paragraph } from '@asap-hub/react-components';

const ResearchOutput: React.FC<{}> = () => {
  const { id } = useParams();
  return (
    <Layout>
      <Paragraph>Research output id: {id}</Paragraph>
    </Layout>
  );
};

export default ResearchOutput;
