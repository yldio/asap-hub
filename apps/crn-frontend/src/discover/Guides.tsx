import { FC } from 'react';
import { DiscoverPageBody } from '@asap-hub/react-components';
import { useDiscoverState } from './state';

const Guides: FC<Record<string, never>> = () => {
  const discover = useDiscoverState();
  return <DiscoverPageBody {...discover} />;
};

export default Guides;
