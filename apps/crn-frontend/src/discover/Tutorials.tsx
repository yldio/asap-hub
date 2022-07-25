import { FC } from 'react';
import { DiscoverTabs } from '@asap-hub/react-components';
import { useDiscoverState } from './state';

const Tutorials: FC<Record<string, never>> = () => {
  const discover = useDiscoverState();
  const title = 'Tutorials';
  const subtitle =
    'Explore our tutorials to understand how you can use the Hub and work with the tools.';

  return (
    <DiscoverTabs title={title} subtitle={subtitle} news={discover.training} />
  );
};

export default Tutorials;
