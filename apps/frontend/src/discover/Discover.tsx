import React, { Suspense } from 'react';

import {
  DiscoverPage,
  Paragraph,
  NotFoundPage,
} from '@asap-hub/react-components';
import { useDiscover } from '../api';
import ErrorBoundary from '../errors/ErrorBoundary';

const loadBody = () => import(/* webpackChunkName: "discover-body" */ './Body');
const Body = React.lazy(loadBody);
loadBody();

const Discover: React.FC<{}> = () => {
  const { loading, data: discover } = useDiscover();

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (discover) {
    // ASAP Staff role is based on job title and institution
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
          <Suspense fallback="Loading...">
            <Body {...data} />
          </Suspense>
        </ErrorBoundary>
      </DiscoverPage>
    );
  }

  return <NotFoundPage />;
};

export default Discover;
