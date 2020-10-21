import React from 'react';

import {
  DiscoverPage,
  DiscoverPageBody,
  Paragraph,
  NotFoundPage,
} from '@asap-hub/react-components';
import { useDiscover } from '../api';

const Discover: React.FC<{}> = () => {
  const { loading, data: discover } = useDiscover();

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

  return <NotFoundPage />;
};

export default Discover;
