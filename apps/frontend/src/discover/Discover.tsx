import { FC, lazy } from 'react';
import {
  DiscoverPage,
  NotFoundPage,
  Loading,
} from '@asap-hub/react-components';

import { useDiscover } from '../api';
import Frame from '../structure/Frame';

const loadBody = () => import(/* webpackChunkName: "discover-body" */ './Body');
const Body = lazy(loadBody);
loadBody();

const Discover: FC<Record<string, never>> = () => {
  const { loading, data } = useDiscover();

  if (loading) {
    return <Loading />;
  }

  if (data) {
    // ASAP Staff role is based on job title and institution
    const discover = {
      ...data,
      members: data.members.map((member) => ({
        ...member,
        role: 'Staff',
        teams: [],
      })),
    };
    return (
      <DiscoverPage>
        <Frame title={null}>
          <Body {...discover} />
        </Frame>
      </DiscoverPage>
    );
  }

  return <NotFoundPage />;
};

export default Discover;
