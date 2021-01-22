import React from 'react';
import { GroupLeader, GroupTeam } from '@asap-hub/model';

import { Card, Headline2, Headline3 } from '../atoms';
import { MembersList } from '../molecules';

interface GroupMembersSectionProps {
  readonly leaders: ReadonlyArray<GroupLeader>;
  readonly teams: ReadonlyArray<GroupTeam>;
}
const GroupMembersSection: React.FC<GroupMembersSectionProps> = ({
  leaders,
}) => (
  <Card>
    <Headline2 styleAsHeading={3}>Group Members</Headline2>
    <Headline3 styleAsHeading={4}>Group Leaders</Headline3>
    <MembersList
      singleColumn
      members={leaders.map((member) => ({
        ...member.user,
        role: member.role,
      }))}
    />
  </Card>
);

export default GroupMembersSection;
