import { FC } from 'react';
import { DiscoverTabs } from '@asap-hub/react-components';
import { useDiscoverState } from './state';

const Tutorials: FC<Record<string, never>> = () => {
  const discover = useDiscoverState();
  return <DiscoverTabs training={discover.training} />;
};

export default Tutorials;
