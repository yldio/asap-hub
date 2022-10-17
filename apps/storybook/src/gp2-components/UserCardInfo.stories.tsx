import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';

import { UserCardInfo } from '@asap-hub/gp2-components';

const { createUserResponse } = gp2Fixtures;

export default {
  title: 'GP2 / Molecules / User Card Info',
  component: UserCardInfo,
};

const props = {
  ...createUserResponse(),
  workingGroups: [],
  projects: [],
};

export const Normal = () => <UserCardInfo {...props} />;
