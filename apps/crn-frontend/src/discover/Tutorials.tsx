import { FC } from 'react';
import { DiscoverTutorials } from '@asap-hub/react-components';
import { useDiscoverState } from './state';

const Tutorials: FC<Record<string, never>> = () => {
  const discover = useDiscoverState();
  return <DiscoverTutorials {...discover} />;
};

export default Tutorials;
