import { FC } from 'react';
import { DiscoverWorkingGroups } from '@asap-hub/react-components';
import { useDiscoverState } from './state';

const WorkingGroups: FC<Record<string, never>> = () => {
  const discover = useDiscoverState();
  return <DiscoverWorkingGroups {...discover} />;
};

export default WorkingGroups;
