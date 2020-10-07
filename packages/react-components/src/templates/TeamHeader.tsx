import React from 'react';
import css from '@emotion/css';
import { formatDistance } from 'date-fns';
import { TeamResponse } from '@asap-hub/model';

import { Link, TabLink, Display, Paragraph, Avatar } from '../atoms';
import { TabNav } from '../molecules';
import { contentSidePaddingWithNavigation } from '../layout';
import { createMailTo } from '../utils';
import { perRem } from '../pixels';
import { paper } from '../colors';

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
      <Display styleAsHeading={2}>{displayName}</Display>
      <section>
        <div>
          <ul css={membersContainerStyle}>
            {members
              .slice(0, 5)
              .map(({ id, avatarURL, firstName, lastName }) => {
                return (
                  <li key={id} css={memberStyle}>
                    <Link href={`/network/users/${id}`} theme={null}>
                      <Avatar
                        small
                        firstName={firstName}
                        lastName={lastName}
                        imageUrl={avatarURL}
                      />
                    </Link>
                  </li>
                );
              })}
            {members.length > 5 ? <li>{`+${members.length - 5}`}</li> : null}
          </ul>
          {pointOfContact && (
            <Link
              buttonStyle
              small
              primary
              href={`${createMailTo(pointOfContact)}`}
            >
              Contact
            </Link>
          )}
        </div>
        {lastModifiedDate && (
          <div>
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
