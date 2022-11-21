import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { UserDetailHeaderCard } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Organisms / Detail Header Card',
  component: UserDetailHeaderCard,
};

const item = {
  ...gp2Fixtures.createUserResponse(),
};

export const Normal = () => <UserDetailHeaderCard {...item} />;
