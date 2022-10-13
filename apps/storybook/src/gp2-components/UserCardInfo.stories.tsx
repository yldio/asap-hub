import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';

import UserCardInfo from '@asap-hub/gp2-components/src/molecules/UserCardInfo';

import UserRegion from '@asap-hub/gp2-components/src/molecules/UserRegion';

import { ComponentProps } from 'react';

const { createUserResponse } = gp2Fixtures;

export default {
  title: 'GP2 / Molecules / User Card Info',
  component: UserCardInfo,
};

type UserCardInfoProps = Pick<ComponentProps<typeof UserRegion>, 'region'> & {
  workingGroups: { id: string; name: string }[];
  projects: { id: string; name: string }[];
  role: string;
};

const props: UserCardInfoProps = {
  ...createUserResponse(),
  workingGroups: [],
  projects: [],
};

export const Overview = () => <UserCardInfo {...props} />;
