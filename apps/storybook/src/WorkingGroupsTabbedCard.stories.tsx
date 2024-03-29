import { ComponentProps } from 'react';
import { WorkingGroupsTabbedCard } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Working Groups Tabbed Card',
};

export const Normal = () => {
  const props: ComponentProps<typeof WorkingGroupsTabbedCard> = {
    isUserAlumni: false,
    groups: [
      {
        id: '1',
        name: 'Group Name',
        role: 'Chair',
        active: true,
      },
      {
        id: '2',
        name: 'Group Name',
        role: 'Member',
        active: true,
      },
      {
        id: '3',
        name: 'Group Name',
        role: 'Chair',
        active: false,
      },
    ],
  };

  return <WorkingGroupsTabbedCard {...props} />;
};
