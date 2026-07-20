import { css } from '@emotion/react';
import { Avatar, Link, OverflowBadge } from '../atoms';
import { rem } from '../pixels';
import { fern } from '../colors';
import { GroupedProjectMember } from '../utils';
import RolesList from './RolesList';
import AvatarWithBadge from './AvatarWithBadge';
import { useFlags } from '@asap-hub/react-context';

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

const teamInfoStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  fontSize: rem(17),
  color: fern.rgb,
});

type ProjectMemberCardProps = {
  readonly member: GroupedProjectMember;
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
  const { isEnabled } = useFlags();

  const userAvatar =
    isEnabled('STAGING_MODE') &&
    member.latestAward &&
    member.latestAward.iconUrl ? (
      <AvatarWithBadge
        imageUrl={member.avatarUrl}
        firstName={member.firstName}
        lastName={member.lastName}
        badgeUrl={member.latestAward.iconUrl}
        badgeAlt={member.latestAward.name}
        badgeSize={18}
        avatarSize={48}
        overrideBadgeStyles={css({ right: rem(0), bottom: rem(0) })}
      />
    ) : (
      <Avatar
        imageUrl={member.avatarUrl}
        firstName={member.firstName || ''}
        lastName={member.lastName || ''}
      />
    );

  return (
    <div css={memberCardStyles}>
      <div css={avatarStyles}>{userAvatar}</div>
      <div css={memberInfoStyles}>
        <Link href={'#'}>
          <span css={nameStyles}>{member.displayName}</span>
        </Link>
        {member.roles.length > 0 && (
          <RolesList roles={member.roles} maxVisible={2} />
        )}
        {showTeamInfo && firstTeam && (
          <div css={teamInfoStyles}>
            <Link href={'#'}>{firstTeam.displayName}</Link>
            {additionalTeamsCount > 0 && (
              <OverflowBadge count={additionalTeamsCount} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectMemberCard;
