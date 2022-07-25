import { FC } from 'react';
import { DiscoverTabs } from '@asap-hub/react-components';
import { useDiscoverState } from './state';

const WorkingGroups: FC<Record<string, never>> = () => {
  const discover = useDiscoverState();
  const title = 'Working Groups';
  const subtitle =
    'Explore our Working Groups to learn more about what they are doing.';

  return (
    <DiscoverTabs
      title={title}
      subtitle={subtitle}
      news={discover.workingGroups}
    />
  );
};

export default WorkingGroups;
