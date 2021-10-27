import { css } from '@emotion/react';
import { formatDistance } from 'date-fns';
import { TeamResponse, TeamTool } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Anchor, Link, TabLink, Display, Paragraph, Avatar } from '../atoms';
import { TabNav } from '../molecules';
import { contentSidePaddingWithNavigation } from '../layout';
import { createMailTo } from '../mail';
import { perRem, mobileScreen } from '../pixels';
import { paper } from '../colors';
import { labIcon } from '../icons';
import { getCounterString } from '../utils';

const MAX_MEMBER_AVATARS = 5;
const MEMBER_AVATAR_BORDER_WIDTH = 1;

const containerStyles = css({
  backgroundColor: paper.rgb,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(10)} 0`,
});

const sectionStyles = css({
  alignItems: 'center',

  display: 'grid',
  gridColumnGap: `${16 / perRem}em`,

  grid: `
    "members" auto
    "contact" auto
    "update"  auto
  `,

  [`@media (min-width: ${mobileScreen.max}px)`]: {
    grid: `
      "contact members update" / max-content 1fr max-content
    `,
  },
});

const updateContainerStyles = css({
  gridArea: 'update',
  alignSelf: 'end',
});

const pointOfContactStyles = css({
  gridArea: 'contact',
  display: 'flex',
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    display: 'block',
  },
});

const membersContainerStyles = css({
  gridArea: 'members',

  display: 'grid',
  gridAutoFlow: 'column',
  gridTemplateColumns: `
    repeat(
      ${MAX_MEMBER_AVATARS},
      minmax(auto, ${36 + MEMBER_AVATAR_BORDER_WIDTH * 2}px)
    )
    ${6 / perRem}em
    minmax(auto, ${36 + MEMBER_AVATAR_BORDER_WIDTH * 2}px)
  `,
});
const membersListStyles = css({
  display: 'contents',
  listStyle: 'none',
});
const extraUsersStyles = css({
  display: 'block',
  gridColumnEnd: '-1',
});
const listItemStyles = css({
  border: '1px solid white',
  borderRadius: '50%',
  position: 'relative',
});
const labCountStyles = css({
  display: 'flex',
  alignItems: 'center',
  padding: `${12 / perRem}em 0`,
});
const iconStyles = css({
  display: 'inline-grid',
  paddingRight: `${12 / perRem}em`,
});

type TeamProfileHeaderProps = Readonly<Omit<TeamResponse, 'tools'>> & {
  readonly tools?: ReadonlyArray<TeamTool>;
  readonly teamListElementId: string;
};
const TeamProfileHeader: React.FC<TeamProfileHeaderProps> = ({
  id,
  displayName,
  lastModifiedDate,
  members,
  pointOfContact,
  tools,
  teamListElementId,
  labCount,
}) => {
  const route = network({}).teams({}).team({ teamId: id });
  return (
    <header css={containerStyles}>
      <Display styleAsHeading={2}>Team {displayName}</Display>
      <section css={sectionStyles}>
        <div css={membersContainerStyles}>
          <ul css={membersListStyles}>
            {members
              .slice(0, MAX_MEMBER_AVATARS)
              .map(({ id: memberId, avatarUrl, firstName, lastName }, i) => (
                <li
                  key={memberId}
                  css={[listItemStyles, { left: `-${i * 3}px` }]}
                >
                  <Anchor
                    href={network({}).users({}).user({ userId: memberId }).$}
                  >
                    <Avatar
                      firstName={firstName}
                      lastName={lastName}
                      imageUrl={avatarUrl}
                    />
                  </Anchor>
                </li>
              ))}
            <li css={extraUsersStyles}>
              {members.length > MAX_MEMBER_AVATARS && (
                <Anchor href={`${route.about({}).$}#${teamListElementId}`}>
                  <Avatar
                    placeholder={`+${members.length - MAX_MEMBER_AVATARS}`}
                  />
                </Anchor>
              )}
            </li>
          </ul>
        </div>
        {pointOfContact && (
          <div css={pointOfContactStyles}>
            <Link
              buttonStyle
              small
              primary
              href={`${createMailTo(pointOfContact.email)}`}
            >
              Contact PM
            </Link>
          </div>
        )}
        {labCount > 0 && (
          <div css={labCountStyles}>
            <span css={iconStyles}>{labIcon} </span>
            <span>{getCounterString(labCount, 'Lab')}</span>
          </div>
        )}
        {lastModifiedDate && (
          <div css={updateContainerStyles}>
            <Paragraph accent="lead">
              <small>
                Last updated:{' '}
                {formatDistance(new Date(), new Date(lastModifiedDate))} ago
              </small>
            </Paragraph>
          </div>
        )}
      </section>
      <TabNav>
        <TabLink href={route.about({}).$}>About</TabLink>
        {tools && (
          <TabLink href={route.workspace({}).$}>Team Workspace</TabLink>
        )}
        <TabLink href={route.outputs({}).$}>Team Outputs</TabLink>
      </TabNav>
    </header>
  );
};

export default TeamProfileHeader;
