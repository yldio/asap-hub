import { ComponentProps } from 'react';

import { Card, Headline2 } from '../atoms';
import { MembersList } from '../molecules';

type TeamMembersSectionProps = {
  readonly title?: string;
  readonly members: ReadonlyArray<
    Omit<ComponentProps<typeof MembersList>['members'][0], 'teams'>
  >;
};

const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({
  members,
  title = `Team Members (${members.length})`,
}) => (
  <Card>
    <Headline2 styleAsHeading={3}>{title}</Headline2>
    <MembersList
      members={members.map((member) => ({ ...member, teams: [] }))}
    />
  </Card>
);

export default TeamMembersSection;
