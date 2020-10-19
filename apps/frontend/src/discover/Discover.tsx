import React from 'react';

import {
  DiscoverPage,
  DiscoverPageBody,
  Paragraph,
  NotFoundPage,
} from '@asap-hub/react-components';
import { useDiscover } from '../api';
import ErrorBoundary from '../errors/ErrorBoundary';

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
        <ErrorBoundary>
          <DiscoverPageBody {...data} />
        </ErrorBoundary>
      </DiscoverPage>
    );
  }

  return <NotFoundPage />;
};

export default Discover;
