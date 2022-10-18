import { FC } from 'react';
import { DiscoverNewsCardList } from '@asap-hub/react-components';
import { useDiscoverState } from '../state';

const Tutorials: FC<Record<string, never>> = () => {
  const { training } = useDiscoverState();

  return (
    <DiscoverNewsCardList
      title="Tutorials"
      subtitle="Explore our tutorials to understand how you can use the Hub and work with the tools."
      news={training}
    />
  );
};

export default Tutorials;
