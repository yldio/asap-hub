import React from 'react';
import css from '@emotion/css';
import { formatDistance } from 'date-fns';
import { TeamResponse, TeamTool } from '@asap-hub/model';

import { Link, TabLink, Display, Paragraph, Avatar } from '../atoms';
import { TabNav } from '../molecules';
import { contentSidePaddingWithNavigation } from '../layout';
import { createMailTo } from '../mail';
import { perRem, mobileScreen } from '../pixels';
import { paper } from '../colors';

const MAX_MEMBER_AVATARS = 5;

const containerStyles = css({
  alignSelf: 'stretch',
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
  gridTemplateColumns: `repeat(${MAX_MEMBER_AVATARS}, minmax(auto, 60px)) ${
    6 / perRem
  }em minmax(auto, 60px)`,
});
const membersListStyles = css({
  display: 'contents',
  listStyle: 'none',
});
const extraUsersStyles = css({
  display: 'block',
  gridColumnEnd: '-1',
});

type TeamProfileHeaderProps = Readonly<Omit<TeamResponse, 'tools'>> & {
  readonly tools?: ReadonlyArray<TeamTool>;
  readonly aboutHref: string;
  readonly outputsHref: string;
  readonly workspaceHref: string;
};
const TeamProfileHeader: React.FC<TeamProfileHeaderProps> = ({
  displayName,
  lastModifiedDate,
  members,
  pointOfContact,
  aboutHref,
  outputsHref,
  workspaceHref,
  tools,
}) => (
  <header css={containerStyles}>
    <Display styleAsHeading={2}>Team {displayName}</Display>
    <section css={sectionStyles}>
      <div css={membersContainerStyles}>
        <ul css={membersListStyles}>
          {members
            .slice(0, MAX_MEMBER_AVATARS)
            .map(({ id, avatarUrl, firstName, lastName }) => (
              <li key={id}>
                <Link href={`/network/users/${id}`} theme={null}>
                  <Avatar
                    firstName={firstName}
                    lastName={lastName}
                    imageUrl={avatarUrl}
                  />
                </Link>
              </li>
            ))}
          <li css={extraUsersStyles}>
            {members.length > MAX_MEMBER_AVATARS && (
              <Avatar placeholder={`+${members.length - MAX_MEMBER_AVATARS}`} />
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
      <TabLink href={aboutHref}>About</TabLink>
      {tools && <TabLink href={workspaceHref}>Team Workspace</TabLink>}
      <TabLink href={outputsHref}>Team Outputs</TabLink>
    </TabNav>
  </header>
);

export default TeamProfileHeader;
