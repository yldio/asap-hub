import { FC } from 'react';
import { DiscoverNewsCardList } from '@asap-hub/react-components';
import { useDiscoverState } from './state';

const WorkingGroups: FC<Record<string, never>> = () => {
  const { workingGroups } = useDiscoverState();

  return (
    <DiscoverNewsCardList
      title="Working Groups"
      subtitle="Explore our Working Groups to learn more about what they are doing."
      news={workingGroups}
    />
  );
};

export default WorkingGroups;
