import { css } from '@emotion/react';
import { TeamListItemResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Card, Anchor, Paragraph, StateTag } from '../atoms';
import { perRem, mobileScreen } from '../pixels';
import { lead } from '../colors';
import { TeamIcon, LabIcon, inactiveBadgeIcon } from '../icons';
import { LinkHeadline, TagList } from '../molecules';
import { getCounterString } from '../utils';

const teamMemberMetaStyles = css({
  color: lead.rgb,
  display: 'flex',
  alignItems: 'center',
  margin: `${24 / perRem}em 0 ${12 / perRem}em 0`,
  gap: `${24 / perRem}em`,
});
const titleStyle = css({
  display: 'flex',
  flexFlow: 'column-reverse',
  gap: `${4 / perRem}em`,
  alignItems: 'flex-start',

  [`@media (min-width: ${mobileScreen.max}px)`]: {
    flexFlow: 'row',
    gap: `${16 / perRem}em`,
    alignItems: 'center',
    marginBottom: `${4 / perRem}em`,
  },
});
const tagsContainer = css({
  margin: `${24 / perRem}em 0 ${12 / perRem}em 0`,
});
const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  paddingRight: `${15 / perRem}em`,
});

const TeamCard: React.FC<TeamListItemResponse> = ({
  id,
  displayName,
  inactiveSince,
  projectTitle,
  tags,
  memberCount,
  labCount,
}) => (
  <Card accent={inactiveSince ? 'neutral200' : 'default'}>
    <div css={titleStyle}>
      <LinkHeadline
        level={2}
        styleAsHeading={4}
        href={network({}).teams({}).team({ teamId: id }).$}
      >
        Team {displayName}
      </LinkHeadline>
      {!!inactiveSince && (
        <StateTag icon={inactiveBadgeIcon} label="Inactive" />
      )}
    </div>
    <Anchor href={network({}).teams({}).team({ teamId: id }).$}>
      <Paragraph noMargin accent="lead">
        {projectTitle}
      </Paragraph>
    </Anchor>
    {!!tags.length && (
      <div css={tagsContainer}>
        <TagList max={3} tags={tags.map(({ name }) => name)} />
      </div>
    )}

    <div css={teamMemberMetaStyles}>
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
  </Card>
);

export default TeamCard;
