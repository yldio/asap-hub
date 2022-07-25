import { FC } from 'react';
import { DiscoverTabs } from '@asap-hub/react-components';
import { useDiscoverState } from './state';

const WorkingGroups: FC<Record<string, never>> = () => {
  const discover = useDiscoverState();
  return <DiscoverTabs workingGroups={discover.workingGroups} />;
};

export default WorkingGroups;
