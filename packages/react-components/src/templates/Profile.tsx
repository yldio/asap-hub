import React from 'react';
import css from '@emotion/css';
import formatDistance from 'date-fns/formatDistance';

import { Avatar, Button, Headline2, Link, Paragraph } from '../atoms';
import { Container } from '../molecules';

const flexContainer = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const lastUpdatedContainer = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
});

type ProfileProps = {
  readonly department: string;
  readonly displayName: string;
  readonly institution: string;
  readonly lastModified: Date;
  readonly location?: string;
  readonly role: string;
  readonly team: string;
  readonly title: string;
};

const Profile: React.FC<ProfileProps> = ({
  department,
  displayName,
  institution,
  lastModified,
  location,
  role,
  team,
  title,
}) => {
  return (
    <Container>
      <div css={[flexContainer]}>
        <div>
          <Headline2>{displayName}</Headline2>
          <Paragraph>
            {title} at {institution}, {department}
            <br />
            {role} on <Link href={'/'}>{team}</Link>
          </Paragraph>
          {location && <Paragraph>{location}</Paragraph>}
        </div>
        <div>
          <Avatar border initials={`PM`} />
        </div>
      </div>
      <div css={[flexContainer]}>
        <Button small primary>
          Contact
        </Button>
        <div css={[lastUpdatedContainer]}>
          <p>Last updated: {formatDistance(new Date(), lastModified)} ago</p>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
