import React from 'react';

import {
  DiscoverPage,
  NotFoundPage,
  Loading,
} from '@asap-hub/react-components';
import { useDiscover } from '../api';
import Frame from '../structure/Frame';

const loadBody = () => import(/* webpackChunkName: "discover-body" */ './Body');
const Body = React.lazy(loadBody);
loadBody();

const Discover: React.FC<{}> = () => {
  const { loading, data: discover } = useDiscover();

  if (loading) {
    return <Loading />;
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
        <Frame>
          <Body {...data} />
        </Frame>
      </DiscoverPage>
    );
  }

  return <NotFoundPage />;
};

export default Discover;
