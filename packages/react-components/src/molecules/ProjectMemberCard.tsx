import { css } from '@emotion/react';
import { ProjectMember } from '@asap-hub/model';
import { Avatar, Link } from '../atoms';
import { rem } from '../pixels';
import { fern, lead, neutral500, neutral900 } from '../colors';

const memberCardStyles = css({
  display: 'flex',
  gap: rem(12),
  alignItems: 'flex-start',
});

const avatarStyles = css({
  flexShrink: 0,
  width: rem(48),
  height: rem(48),
});

const memberInfoStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
  flex: 1,
});

const nameStyles = css({
  fontSize: rem(17),
  fontWeight: 500,
  color: fern.rgb,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const roleStyles = css({
  fontSize: rem(17),
  color: lead.rgb,
});

const teamInfoStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  fontSize: rem(17),
  color: fern.rgb,
});

const additionalTeamsBadgeStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(24),
  height: rem(24),
  borderRadius: '50%',
  color: neutral900.rgb,
  border: `1px solid ${neutral500.rgba}!important`,
  backgroundColor: 'transparent',
  fontSize: rem(14),
  fontWeight: 700,
  lineHeight: 1,
  padding: rem(2),
});

type ProjectMemberCardProps = {
  readonly member: ProjectMember;
  /** Whether to show team information (true for trainee, false for resource not team-based) */
  readonly showTeamInfo?: boolean;
};

const ProjectMemberCard: React.FC<ProjectMemberCardProps> = ({
  member,
  showTeamInfo = false,
}) => {
  const teams = member.teams || [];
  const firstTeam = teams[0];
  const additionalTeamsCount = teams.length > 1 ? teams.length - 1 : 0;

  return (
    <div css={memberCardStyles}>
      <div css={avatarStyles}>
        <Avatar
          imageUrl={member.avatarUrl}
          firstName={member.firstName || ''}
          lastName={member.lastName || ''}
        />
      </div>
      <div css={memberInfoStyles}>
        <Link href={'#'}>
          <span css={nameStyles}>{member.displayName}</span>
        </Link>
        {member.role && <div css={roleStyles}>{member.role}</div>}
        {showTeamInfo && firstTeam && (
          <div css={teamInfoStyles}>
            <Link href={'#'}>{firstTeam.displayName}</Link>
            {additionalTeamsCount > 0 && (
              <div css={additionalTeamsBadgeStyles}>
                +{additionalTeamsCount}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectMemberCard;
