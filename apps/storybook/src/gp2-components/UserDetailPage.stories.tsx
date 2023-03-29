import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { UserDetailPage } from '@asap-hub/gp2-components';
import { ComponentProps } from 'react';

export default {
  title: 'GP2 / Templates / Users Directory / User Detail Page',
  component: UserDetailPage,
};

const item: ComponentProps<typeof UserDetailPage> = {
  ...gp2Fixtures.createUserResponse(),
  outputsTotal: 1,
  upcomingTotal: 2,
  pastTotal: 4,
};

export const Normal = () => <UserDetailPage {...item} />;
