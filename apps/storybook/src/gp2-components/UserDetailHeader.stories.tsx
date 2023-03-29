import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { UserDetailHeader } from '@asap-hub/gp2-components';
import { ComponentProps } from 'react';

export default {
  title: 'GP2 / Organisms / User Directory / Detail Header',
  component: UserDetailHeader,
};

const item: ComponentProps<typeof UserDetailHeader> = {
  ...gp2Fixtures.createUserResponse(),
  outputsTotal: 1,
  upcomingTotal: 2,
  pastTotal: 4,
};

export const Normal = () => <UserDetailHeader {...item} />;
