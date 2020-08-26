import React from 'react';
import css from '@emotion/css';
import { formatDistance } from 'date-fns';
import { contentSidePaddingWithNavigation } from '../pixels';
import { Link, TabLink, Display, Button, Paragraph, Avatar } from '../atoms';
import { TabNav } from '../molecules';
import { TeamResponse } from '../../../model/src';

const containerStyles = css({
  alignSelf: 'stretch',

  padding: `0 ${contentSidePaddingWithNavigation(8)}`,
});

type TeamProps = TeamResponse & {
  readonly aboutHref: string;
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
  members,
  aboutHref,
  displayName,
  lastModifiedDate,
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
                    <Link underline={false} href={`/users/${id}`}>
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
          <Button small primary>
            Contact
          </Button>
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
      </TabNav>
    </header>
  );
};

export default TeamHeader;
