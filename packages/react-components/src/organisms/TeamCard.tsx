import { css } from '@emotion/react';
import { TeamResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Card, Anchor, Paragraph, Headline2 } from '../atoms';
import { perRem } from '../pixels';
import { lead } from '../colors';
import { teamIcon, labIcon } from '../icons';
import { TagList } from '../molecules';
import { getCounterString } from '../utils';

const teamMemberMetaStyles = css({
  color: lead.rgb,
  display: 'flex',
  alignItems: 'center',
  padding: `${12 / perRem}em 0`,
  gap: `${24 / perRem}em`,
});
const tagsPadding = css({
  paddingBottom: `${12 / perRem}em`,
});
const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  paddingRight: `${15 / perRem}em`,
});

type TeamCardProps = Pick<
  TeamResponse,
  'id' | 'displayName' | 'projectTitle' | 'skills' | 'members' | 'labCount'
>;

const TeamCard: React.FC<TeamCardProps> = ({
  id,
  displayName,
  projectTitle,
  skills,
  members,
  labCount,
}) => (
  <Card>
    <Anchor href={network({}).teams({}).team({ teamId: id }).$}>
      <Headline2 styleAsHeading={4}>Team {displayName}</Headline2>
      <Paragraph accent="lead">{projectTitle}</Paragraph>
    </Anchor>
    {!!skills.length && (
      <div css={tagsPadding}>
        <TagList min={5} max={5} tags={skills} />
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
