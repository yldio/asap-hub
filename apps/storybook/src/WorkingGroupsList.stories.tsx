import { ComponentProps } from 'react';
import { WorkingGroupsList } from '@asap-hub/react-components';

export default {
  title: 'Molecules/ Working Groups List',
};

export const Normal = () => {
  const props: ComponentProps<typeof WorkingGroupsList> = {
    groups: [
      {
        id: '1',
        name: 'Group Name',
        role: 'Something',
      },
      {
        id: '2',
        name: 'Group Name',
        role: 'Something',
      },
      {
        id: '3',
        name: 'Group Name',
        role: 'Something',
      },
    ],
  };

  return <WorkingGroupsList {...props} />;
};
