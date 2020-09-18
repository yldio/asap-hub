import React from 'react';
import css from '@emotion/css';
import { formatDistance } from 'date-fns';
import { Link, TabLink, Display, Button, Paragraph, Avatar } from '../atoms';
import { TabNav } from '../molecules';
import { TeamResponse } from '../../../model/src';
import { contentSidePaddingWithNavigation } from '../layout';

const containerStyles = css({
  alignSelf: 'stretch',

  padding: `0 ${contentSidePaddingWithNavigation(8)}`,
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
                    <Link href={`/users/${id}`} theme={null}>
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
        <TabLink href={outputsHref}>Outputs</TabLink>
      </TabNav>
    </header>
  );
};

export default TeamHeader;
