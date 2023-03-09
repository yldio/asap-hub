import { NavigationHeader } from '@asap-hub/gp2-components';
import { ComponentProps } from 'react';

export default {
  title: 'GP2 / Organisms / Navigation Header',
  component: NavigationHeader,
};

const props: ComponentProps<typeof NavigationHeader> = {
  menuShown: false,
  onToggleMenu: () => {},
  projects: [],
  userId: '1',
  workingGroups: [],
};
export const Normal = () => <NavigationHeader {...props} />;
