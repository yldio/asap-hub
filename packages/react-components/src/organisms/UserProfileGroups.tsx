import { FC } from 'react';
import { UserResponse, GroupResponse } from '@asap-hub/model';

import { Card, Headline2, Paragraph } from '../atoms';
import UserGroupList from './UserGroupsList';

type UserProfileGroupsProps = Pick<UserResponse, 'firstName' | 'id'> & {
  readonly groups: ReadonlyArray<GroupResponse>;
};
const UserProfileGroups: FC<UserProfileGroupsProps> = ({
  firstName,
  id,
  groups,
}) => (
  <Card>
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Headline2 styleAsHeading={3}>{firstName}’s Groups</Headline2>
      <Paragraph accent="lead">
        {firstName}’s team is collaborating with other teams via groups, which
        meet frequently
      </Paragraph>
      <UserGroupList groups={groups} id={id} />
    </div>
  </Card>
);
export default UserProfileGroups;
