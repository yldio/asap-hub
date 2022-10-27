import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { UserDetailPage } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Templates / Users Directory / User Detail Page',
  component: UserDetailPage,
};

const item = {
  ...gp2Fixtures.createUserResponse(),
  backHref: '/',
};

export const Normal = () => <UserDetailPage {...item} />;
