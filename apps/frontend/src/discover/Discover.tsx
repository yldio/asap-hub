import React from 'react';

import {
  DiscoverPage,
  DiscoverPageBody,
  Paragraph,
} from '@asap-hub/react-components';
import { useDiscover } from '../api';

const Discover: React.FC<{}> = () => {
  const { loading, data: discover, error } = useDiscover();

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (discover) {
    const data = {
      ...discover,
      members: discover.members.map((m) => ({
        ...m,
        role: 'Staff',
      })),
    };
    return (
      <DiscoverPage>
        <DiscoverPageBody {...data} />
      </DiscoverPage>
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

export default Discover;
