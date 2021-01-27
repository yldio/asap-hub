import React from 'react';
import { join } from 'path';
import {
  DiscoverPage,
  NotFoundPage,
  Loading,
} from '@asap-hub/react-components';
import { useDiscover } from '../api';
import Frame from '../structure/Frame';

import { NEWS_AND_EVENTS_PATH, NETWORK_PATH } from '../routes';
import { USERS_PATH } from '../network/routes';

const loadBody = () => import(/* webpackChunkName: "discover-body" */ './Body');
const Body = React.lazy(loadBody);
loadBody();

const Discover: React.FC<Record<string, never>> = () => {
  const { loading, data } = useDiscover();

  if (loading) {
    return <Loading />;
  }

  if (data) {
    // ASAP Staff role is based on job title and institution
    const discover = {
      ...data,
      training: data.training.map((t) => ({
        ...t,
        href: join(NEWS_AND_EVENTS_PATH, t.id),
      })),
      members: data.members.map((member) => ({
        ...member,
        href: join(NETWORK_PATH, USERS_PATH, member.id),
        role: 'Staff',
        teams: [],
      })),
    };
    return (
      <DiscoverPage>
        <Frame>
          <Body {...discover} />
        </Frame>
      </DiscoverPage>
    );
  }

  return <NotFoundPage />;
};

export default Discover;
