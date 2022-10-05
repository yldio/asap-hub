import { css } from '@emotion/react';
import { TeamResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Card, Anchor, Paragraph, StateTag } from '../atoms';
import { perRem, mobileScreen } from '../pixels';
import { lead } from '../colors';
import { teamIcon, labIcon } from '../icons';
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

type TeamCardProps = Pick<
  TeamResponse,
  | 'id'
  | 'displayName'
  | 'inactiveSince'
  | 'projectTitle'
  | 'expertiseAndResourceTags'
  | 'members'
  | 'labCount'
>;

const TeamCard: React.FC<TeamCardProps> = ({
  id,
  displayName,
  inactiveSince,
  projectTitle,
  expertiseAndResourceTags,
  members,
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
      {!!inactiveSince && <StateTag label="Inactive" />}
    </div>
    <Anchor href={network({}).teams({}).team({ teamId: id }).$}>
      <Paragraph hasMargin={false} accent="lead">
        {projectTitle}
      </Paragraph>
    </Anchor>
    {!!expertiseAndResourceTags.length && (
      <div css={tagsContainer}>
        <TagList min={5} max={5} tags={expertiseAndResourceTags} />
      </div>
    )}

    <div css={teamMemberMetaStyles}>
      <div>
        <span css={iconStyles}>{teamIcon} </span>
        <span>{getCounterString(members.length, 'Team Member')}</span>
      </div>
      {labCount > 0 && (
        <div>
          <span css={iconStyles}>{labIcon} </span>
          <span>{getCounterString(labCount, 'Lab')}</span>
        </div>
      )}
    </div>
  </Card>
);

export default TeamCard;
