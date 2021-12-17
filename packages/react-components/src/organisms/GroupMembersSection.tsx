import { css } from '@emotion/react';
import { GroupResponse } from '@asap-hub/model';

import { Card, Headline2, Headline3 } from '../atoms';
import { MembersList, AssociationList } from '../molecules';
import { tabletScreen } from '../pixels';

const gridStyles = css({
  display: 'grid',
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    gridAutoFlow: 'column',
    gridTemplate: 'auto auto / 1fr 1fr',
    alignItems: 'start',
  },
});

type GroupMembersSectionProps = Pick<GroupResponse, 'leaders' | 'teams'>;
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
        members={leaders.map(({ user, role }) => ({
          id: user.id,
          displayName: user.displayName,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
          teams: user.teams,
          role,
        }))}
      />
      <Headline3 styleAsHeading={4}>Teams ({teams.length})</Headline3>
      <AssociationList type="Team" associations={teams} />
    </div>
  </Card>
);

export default GroupMembersSection;
