import React from 'react';
import { TeamMember } from '@asap-hub/model';

import { Card, Headline2 } from '../atoms';
import { MembersList } from '../molecules';

type TeamMembersSectionProps = {
  readonly title?: string;
  readonly members: ReadonlyArray<
    Omit<TeamMember, 'role'> & {
      role: string;
    }
  >;
};

const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({
  members,
  title = `Team Members (${members.length})`,
}) => (
  <Card>
    <Headline2 styleAsHeading={3}>{title}</Headline2>
    <MembersList members={members} />
  </Card>
);

export default TeamMembersSection;
