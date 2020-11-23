import React, { ComponentProps } from 'react';
import { UserProfileStaff } from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';

import { DISCOVER_PATH } from '../../routes';

type StaffProps = {
  user: UserResponse;
  teams: ComponentProps<typeof UserProfileStaff>['teams'];
};
const Staff: React.FC<StaffProps> = ({ user, teams }) => (
  <UserProfileStaff {...user} teams={teams} discoverHref={DISCOVER_PATH} />
);

export default Staff;
