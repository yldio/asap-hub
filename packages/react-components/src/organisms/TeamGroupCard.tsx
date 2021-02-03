import React, { useState } from 'react';
import css from '@emotion/css';
import { ListGroupResponse } from '@asap-hub/model';
import {
  Card,
  Paragraph,
  Headline3,
  Button,
  Divider,
  Headline4,
} from '../atoms';
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
  paddingTop: `${18 / perRem}`,
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
  paddingRight: `${6 / perRem}em`,
});

const listStyles = css({
  margin: 0,
  padding: `${24 / perRem}em 0 ${6 / perRem}em 0`,
  textIndent: 0,
  listStyleType: 'none',
});
const listElementStyles = css({
  paddingBottom: vminLinearCalcClamped(
    mobileScreen,
    18,
    smallDesktopScreen,
    24,
    'px',
  ),
});

const viewMoreStyles = css({
  display: 'flex',
  justifyContent: 'center',
  paddingBottom: `${18 / perRem}em`,
});

const TeamGroupCard: React.FC<ListGroupResponse> = ({ items }) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <Card>
      <Headline3>Team Groups ({items.length})</Headline3>
      <Paragraph accent={'lead'}>
        This team is collaborating with other teams via groups, which meet
        frequently
      </Paragraph>
      <ul css={listStyles}>
        {items
          .slice(0, showMore ? items.length : LESS_GROUP_LIMIT)
          .map(({ teams, description, name }, index) => (
            <li css={listElementStyles} key={`group-team-${index}`}>
              <Headline4>{name}</Headline4>
              <Paragraph accent="lead">{description}</Paragraph>
              <span css={teamsStyles}>
                <span css={iconStyles}>{teamIcon} </span>
                {teams.length} Team{teams.length !== 1 ? 's' : ''}
              </span>
              {!(
                index === items.length - 1 && items.length <= LESS_GROUP_LIMIT
              ) && <Divider />}
            </li>
          ))}
      </ul>
      {items.length > LESS_GROUP_LIMIT && (
        <div css={viewMoreStyles}>
          <Button linkStyle onClick={() => setShowMore(!showMore)}>
            View {showMore ? 'less' : 'more'} groups
          </Button>
        </div>
      )}
    </Card>
  );
};

export default TeamGroupCard;
