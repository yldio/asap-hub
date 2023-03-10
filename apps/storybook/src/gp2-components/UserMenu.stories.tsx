import { UserMenu } from '@asap-hub/gp2-components';
import { ComponentProps } from 'react';

export default {
  title: 'GP2 / Molecules / User Directory / Menu',
  component: UserMenu,
};

const props: ComponentProps<typeof UserMenu> = {
  closeUserMenu: () => {},
  projects: [],
  userId: '1',
  workingGroups: [],
};
export const Normal = () => <UserMenu {...props} />;
