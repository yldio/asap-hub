import { css } from '@emotion/react';
import { TeamListItemResponse } from '@asap-hub/model';
import { networkRoutes } from '@asap-hub/routing';

import { StateTag } from '../atoms';
import { mobileScreen, rem } from '../pixels';
import { lead } from '../colors';
import { TeamIcon, LabIcon, InactiveBadgeIcon } from '../icons';
import { getCounterString } from '../utils';
import { EntityCard } from '.';

const footerStyles = css({
  color: lead.rgb,

  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),

  [`@media (min-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'row',
    gap: rem(32),
  },
});

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  paddingRight: rem(8),
});

const TeamCard: React.FC<TeamListItemResponse> = ({
  id,
  displayName,
  inactiveSince,
  projectTitle,
  tags,
  memberCount,
  labCount,
}) => {
  const href = networkRoutes.DEFAULT.TEAMS.DETAILS.buildPath({ teamId: id });

  const footer = (
    <div css={footerStyles}>
      <div>
        <span css={iconStyles}>
          <TeamIcon />{' '}
        </span>
        <span>{getCounterString(memberCount, 'Team Member')}</span>
      </div>
      {labCount > 0 && (
        <div>
          <span css={iconStyles}>
            <LabIcon />{' '}
          </span>
          <span>{getCounterString(labCount, 'Lab')}</span>
        </div>
      )}
    </div>
  );

  return (
    <EntityCard
      active={!inactiveSince}
      footer={footer}
      href={href}
      inactiveBadge={<StateTag icon={<InactiveBadgeIcon />} label="Inactive" />}
      tags={tags.map(({ name }) => name)}
      text={projectTitle}
      title={`Team ${displayName}`}
    />
  );
};

export default TeamCard;
