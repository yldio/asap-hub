import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paragraph } from '@asap-hub/react-components';
import { useNewsBySlug } from '../api';

const Page: React.FC<{}> = () => {
  const { slug } = useParams();

  const { loading, data: news, error } = useNewsBySlug(slug);

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (news) {
    return (
      <Container>
        <pre>{JSON.stringify(news, null, 2)}</pre>
      </Container>
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

export default Page;
