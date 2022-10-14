import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';

import { UserCardInfo } from '@asap-hub/gp2-components';

import { ComponentProps } from 'react';

const { createUserResponse } = gp2Fixtures;

export default {
  title: 'GP2 / Molecules / User Card Info',
  component: UserCardInfo,
};

const props: ComponentProps<typeof UserCardInfo> = {
  ...createUserResponse(),
  workingGroups: [],
  projects: [],
};

export const Normal = () => <UserCardInfo {...props} />;
