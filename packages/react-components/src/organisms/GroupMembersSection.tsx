import React, { ComponentProps } from 'react';
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
  readonly leaders: ComponentProps<typeof MembersList>['members'];
  readonly teams: ComponentProps<typeof TeamsList>['teams'];
}
const GroupMembersSection: React.FC<GroupMembersSectionProps> = ({
  leaders,
  teams,
}) => (
  <Card>
    <Headline2 styleAsHeading={3}>Group Members</Headline2>
    <div css={gridStyles}>
      <Headline3 styleAsHeading={4}>Group Leaders</Headline3>
      <MembersList singleColumn members={leaders} />
      <Headline3 styleAsHeading={4}>Teams ({teams.length})</Headline3>
      <TeamsList teams={teams} />
    </div>
  </Card>
);

export default GroupMembersSection;
