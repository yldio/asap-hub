import React from 'react';
import css from '@emotion/css';
import { formatDistance } from 'date-fns';
import { TeamResponse } from '@asap-hub/model';

import { Link, TabLink, Display, Paragraph, Avatar } from '../atoms';
import { TabNav } from '../molecules';
import { contentSidePaddingWithNavigation } from '../layout';
import { createMailTo } from '../utils';
import { perRem, mobileScreen } from '../pixels';
import { paper, lead } from '../colors';

const containerStyles = css({
  alignSelf: 'stretch',
  backgroundColor: paper.rgb,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} 0`,
});

type TeamProps = TeamResponse & {
  readonly aboutHref: string;
  readonly outputsHref: string;
};

const memberStyle = css({});
const membersContainerStyle = css({
  padding: 0,
  listStyle: 'none',

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  gridArea: 'members',
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
      "contact members update" auto / auto 1fr auto
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

const extraUsersStyles = css({
  display: 'grid',
  height: `${48 / perRem}em`,
  width: `${48 / perRem}em`,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  border: `1px solid ${lead.rgb}`,
  fontWeight: 'bold',
  marginLeft: `${6 / perRem}em`,
});

const TeamHeader: React.FC<TeamProps> = ({
  displayName,
  lastModifiedDate,
  members,
  pointOfContact,

  aboutHref,
  outputsHref,
}) => {
  return (
    <header css={containerStyles}>
      <Display styleAsHeading={2}>Team {displayName}</Display>
      <section css={sectionStyles}>
        <ul css={membersContainerStyle}>
          {members.slice(0, 5).map(({ id, avatarUrl, firstName, lastName }) => {
            return (
              <li key={id} css={memberStyle}>
                <Link href={`/network/users/${id}`} theme={null}>
                  <Avatar
                    small
                    firstName={firstName}
                    lastName={lastName}
                    imageUrl={avatarUrl}
                  />
                </Link>
              </li>
            );
          })}
          {members.length > 5 ? (
            <li css={extraUsersStyles}>{`+${members.length - 5}`}</li>
          ) : null}
        </ul>
        {pointOfContact && (
          <div css={pointOfContactStyles}>
            <Link
              buttonStyle
              small
              primary
              href={`${createMailTo(pointOfContact)}`}
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
        <TabLink href={outputsHref}>Outputs</TabLink>
      </TabNav>
    </header>
  );
};

export default TeamHeader;
