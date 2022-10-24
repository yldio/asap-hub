import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { UserDetailHeader } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Organisms / User Directory / Detail Header',
  component: UserDetailHeader,
};

const item = {
  ...gp2Fixtures.createUserResponse(),
  backHref: '/',
};

export const Normal = () => <UserDetailHeader {...item} />;
