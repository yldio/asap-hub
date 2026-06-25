import { useState } from 'react';
import { css } from '@emotion/react';
import { UserAwardWithTeam } from '@asap-hub/model';

import { Button, Card, Headline2, Paragraph } from '../atoms';
import { lead } from '../colors';
import { rem } from '../pixels';

export const badgesAnchorId = 'badges';

const MAX_VISIBLE_BADGES = 4;

const badgeSize = 72;

const listStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(40),
  padding: 0,
  margin: 0,
  listStyle: 'none',
});

const itemStyles = css({
  width: rem(badgeSize),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: rem(8),
});

const iconStyles = css({
  width: rem(badgeSize),
  height: rem(badgeSize),
  objectFit: 'contain',
});

const teamNameStyles = css({
  color: lead.rgb,
  overflowWrap: 'anywhere',
});

const showMoreStyles = css({
  marginTop: rem(12),
  display: 'flex',
  justifyContent: 'center',
});

type UserProfileBadgesProps = {
  readonly badges: UserAwardWithTeam[];
};

const UserProfileBadges: React.FC<UserProfileBadgesProps> = ({ badges }) => {
  const [showMore, setShowMore] = useState(false);

  if (badges.length === 0) {
    return null;
  }

  const hasMore = badges.length > MAX_VISIBLE_BADGES;
  const visibleBadges = showMore ? badges : badges.slice(0, MAX_VISIBLE_BADGES);

  return (
    <div id={badgesAnchorId}>
      <Card>
        <Headline2 styleAsHeading={3}>Badges</Headline2>
        <Paragraph accent="lead">
          Explore all badges this member has achieved.
        </Paragraph>
        <ul css={listStyles}>
          {visibleBadges.map((badge, index) => (
            <li
              key={`${badge.name}-${badge.teamName}-${badge.date}-${index}`}
              css={itemStyles}
            >
              {badge.iconUrl && (
                <img css={iconStyles} src={badge.iconUrl} alt={badge.name} />
              )}
              {badge.teamName && (
                <Paragraph noMargin styles={teamNameStyles}>
                  {badge.teamName}
                </Paragraph>
              )}
            </li>
          ))}
        </ul>
        {hasMore && (
          <div css={showMoreStyles}>
            <Button linkStyle onClick={() => setShowMore(!showMore)}>
              {showMore ? 'View less' : 'View more'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserProfileBadges;
