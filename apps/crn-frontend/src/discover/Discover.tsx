import { FC, lazy } from 'react';
import { DiscoverPage, NotFoundPage } from '@asap-hub/react-components';
import { Frame } from '@asap-hub/structure';
import { useDiscoverState } from './state';

const loadBody = () => import(/* webpackChunkName: "discover-body" */ './Body');
const Body = lazy(loadBody);
loadBody();

const Discover: FC<Record<string, never>> = () => {
  const discover = useDiscoverState();

  if (discover) {
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
