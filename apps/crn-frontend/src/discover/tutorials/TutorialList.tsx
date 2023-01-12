import { FC } from 'react';
import { DiscoverTutorialsCardList } from '@asap-hub/react-components';
import { useDiscoverState } from '../state';

const Tutorials: FC<Record<string, never>> = () => {
  const { training } = useDiscoverState();

  return (
    <DiscoverTutorialsCardList
      title="Tutorials"
      subtitle="Explore our tutorials to understand how you can use the Hub and work with the tools."
      news={training}
    />
  );
};

export default Tutorials;
