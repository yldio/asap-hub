import React, { ComponentProps } from 'react';
import { ProfileStaff } from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';

type StaffProps = {
  userProfile: UserResponse;
  teams: ComponentProps<typeof ProfileStaff>['teams'];
};
const Staff: React.FC<StaffProps> = ({ userProfile, teams }) => (
  <ProfileStaff {...userProfile} teams={teams} discoverHref="/discover" />
);

export default Staff;
