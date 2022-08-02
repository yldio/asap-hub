import { useState } from 'react';
import { css } from '@emotion/react';
import { GroupResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Card, Paragraph, Headline3, Button, Divider } from '../atoms';
import { LinkHeadline } from '../molecules';
import {
  perRem,
  mobileScreen,
  smallDesktopScreen,
  vminLinearCalcClamped,
} from '../pixels';
import { teamIcon } from '../icons';
import { charcoal } from '../colors';

const LESS_GROUP_LIMIT = 2;

const teamsStyles = css({
  color: charcoal.rgb,
  display: 'flex',
  alignItems: 'center',
  paddingTop: `${12 / perRem}em`,
  paddingBottom: vminLinearCalcClamped(
    mobileScreen,
    18,
    smallDesktopScreen,
    24,
    'px',
  ),
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${15 / perRem}em`,
});

const listStyles = css({
  padding: `${12 / perRem}em 0 0 0`,
  margin: 0,
  listStyleType: 'none',
});
const listElementStyles = css({
  paddingBottom: vminLinearCalcClamped(
    mobileScreen,
    6,
    smallDesktopScreen,
    12,
    'px',
  ),

  ':last-child': {
    paddingBottom: 0,
  },
});

const viewMoreStyles = css({
  display: 'flex',
  paddingTop: vminLinearCalcClamped(
    mobileScreen,
    6,
    smallDesktopScreen,
    12,
    'px',
  ),
  justifyContent: 'center',
});

type TeamGroupsCardProps = {
  readonly groups: ReadonlyArray<GroupResponse>;
};

const TeamGroupsCard: React.FC<TeamGroupsCardProps> = ({ groups }) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <Card>
      <Headline3>Team Groups ({groups.length})</Headline3>
      <Paragraph accent={'lead'}>
        This team is collaborating with other teams via groups, which meet
        frequently
      </Paragraph>
      <ul css={listStyles}>
        {groups
          .slice(0, showMore ? groups.length : LESS_GROUP_LIMIT)
          .map(({ id, teams, description, name }, index) => (
            <li css={listElementStyles} key={`team-group-${index}`}>
              <LinkHeadline
                href={network({}).groups({}).group({ groupId: id }).$}
                level={4}
              >
                {name}
              </LinkHeadline>
              <Paragraph accent="lead">{description}</Paragraph>
              <span css={teamsStyles}>
                <span css={iconStyles}>{teamIcon} </span>
                {teams.length} Team{teams.length !== 1 ? 's' : ''}
              </span>
              {(index === groups.length - 1 &&
                groups.length <= LESS_GROUP_LIMIT) || <Divider />}
            </li>
          ))}
      </ul>
      {groups.length > LESS_GROUP_LIMIT && (
        <div css={viewMoreStyles}>
          <Button linkStyle onClick={() => setShowMore(!showMore)}>
            {showMore ? 'View less' : 'View more'} groups
          </Button>
        </div>
      )}
    </Card>
  );
};

export default TeamGroupsCard;
