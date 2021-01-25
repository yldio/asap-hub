import React from 'react';
import { GroupLeader, GroupTeam } from '@asap-hub/model';
import css from '@emotion/css';

import { Card, Headline2, Headline3 } from '../atoms';
import { MembersList, TeamsList } from '../molecules';
import { tabletScreen } from '../pixels';

const gridStyles = css({
  display: 'grid',
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    gridAutoFlow: 'column',
    gridTemplate: 'auto auto / 1fr 1fr',
    alignItems: 'start',
  },
});

interface GroupMembersSectionProps {
  readonly leaders: ReadonlyArray<GroupLeader & { href: string }>;
  readonly teams: ReadonlyArray<GroupTeam & { href: string }>;
}
const GroupMembersSection: React.FC<GroupMembersSectionProps> = ({
  leaders,
  teams,
}) => (
  <Card>
    <Headline2 styleAsHeading={3}>Group Members</Headline2>
    <div css={gridStyles}>
      <Headline3 styleAsHeading={4}>Group Leaders</Headline3>
      <MembersList
        singleColumn
        members={leaders.map((member) => ({
          ...member.user,
          role: member.role,
        }))}
      />
      <Headline3 styleAsHeading={4}>Teams ({teams.length})</Headline3>
      <TeamsList
        teams={teams.map(({ displayName, href }) => ({
          name: displayName,
          href,
        }))}
      />
    </div>
  </Card>
);

export default GroupMembersSection;
