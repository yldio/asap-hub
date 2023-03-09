import { UserNavigation } from '@asap-hub/gp2-components';
import { ComponentProps } from 'react';

export default {
  title: 'GP2 / Organisms / User Directory / User Navigation',
  component: UserNavigation,
};

const props: ComponentProps<typeof UserNavigation> = {
  menuShown: false,
  projects: [],
  userId: '1',
  workingGroups: [],
};
export const Normal = () => <UserNavigation {...props} />;
