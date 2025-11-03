import { css } from '@emotion/react';
import { ProjectMember } from '@asap-hub/model';
import { rem, tabletScreen } from '../pixels';
import ProjectMemberCard from './ProjectMemberCard';

const membersListStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: rem(24),
  [`@media (max-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '1fr',
  },
});

type ProjectMembersProps = {
  readonly members: ReadonlyArray<ProjectMember>;
  /** Show team info (true for trainee, false for resource not team-based) */
  readonly showTeamInfo?: boolean;
};

const ProjectMembers: React.FC<ProjectMembersProps> = ({
  members,
  showTeamInfo = false,
}) => (
  <div css={membersListStyles}>
    {members.map((member) => (
      <ProjectMemberCard
        key={member.id}
        member={member}
        showTeamInfo={showTeamInfo}
      />
    ))}
  </div>
);

export default ProjectMembers;
