import { useLayoutEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { UserAwardWithTeam } from '@asap-hub/model';

import { Button, Card, Headline2, Paragraph } from '../atoms';
import { fern, lead, steel } from '../colors';
import { rem } from '../pixels';

export const badgesAnchorId = 'badges';

const badgeSize = 80;
const rowGap = 40;
const itemWidth = 85;

const containerStyles = css({
  padding: `${rem(32)} 0 0`,
});

const headerStyles = css({
  paddingInline: rem(16),
});
const listStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(rowGap),
  paddingInline: rem(24),
  marginBottom: rem(32),
  marginTop: 0,
  // marginBottom: rem(32),
  marginInline: 0,
  listStyle: 'none',
});

const itemStyles = css({
  width: rem(85),
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: rem(12),
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

const showMoreButtonStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  fontWeight: 'normal',
  color: fern.rgba,
  borderTop: `1px solid ${steel.rgb}`,
  marginTop: rem(32),
  paddingTop: rem(16),
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'none',
  },
});

const showMoreButtonTextStyles = css({
  height: rem(24),
  display: 'flex',
  alignItems: 'center',
  marginBottom: rem(16),
});

type UserProfileBadgesProps = {
  readonly badges: UserAwardWithTeam[];
};

const UserProfileBadges: React.FC<UserProfileBadgesProps> = ({ badges }) => {
  const [showMore, setShowMore] = useState(false);
  // how many badges to show when collapsed: one fewer than fit the first row,
  // so there is always a visible cue that more badges exist behind "Show more"
  // when collapsed, show as many badges as fit one row (measured from the
  // container width); starts at all so it stays correct before first measure
  const [collapsedCount, setCollapsedCount] = useState(badges.length);
  const listRef = useRef<HTMLUListElement>(null);

  // How many badges fit one row depends on the list's width. Derive it from the
  // container width and the known item metrics so the count is correct whether
  // the list is currently collapsed (fewer items rendered) or expanded.
  useLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current;
      if (!list) {
        return;
      }
      const width = list.clientWidth;
      const perRow = Math.max(
        1,
        Math.floor((width + rowGap) / (itemWidth + rowGap)),
      );
      setCollapsedCount(perRow);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [badges]);

  if (badges.length === 0) {
    return null;
  }

  const hasMore = badges.length > collapsedCount;
  const visibleBadges =
    showMore || !hasMore ? badges : badges.slice(0, collapsedCount);

  return (
    <div id={badgesAnchorId}>
      <Card padding={false} overrideStyles={containerStyles}>
        <Headline2 styleAsHeading={3} noMargin overrideStyles={headerStyles}>
          Badges
        </Headline2>
        <Paragraph
          accent="lead"
          noMargin
          styles={css({ margin: `${rem(24)} ${rem(24)} ${rem(32)}` })}
        >
          Explore all badges this member has achieved.
        </Paragraph>
        <ul ref={listRef} css={listStyles}>
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
          <Button
            linkStyle
            onClick={() => setShowMore(!showMore)}
            overrideStyles={showMoreButtonStyles}
          >
            <span css={showMoreButtonTextStyles}>
              {showMore ? 'View Less Badges' : 'View More Badges'}
            </span>
          </Button>
        )}
      </Card>
    </div>
  );
};

export default UserProfileBadges;
