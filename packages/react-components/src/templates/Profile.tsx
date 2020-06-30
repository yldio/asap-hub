import React from 'react';
import css from '@emotion/css';

import { Button, Headline2, Link, Paragraph } from '../atoms';
import { Container } from '../molecules';

const bottomContainer = css({
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
  readonly location: string;
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
      <Headline2>{displayName}</Headline2>
      <Paragraph>
        {title} at {institution}, {department}
        <br />
        {role} on <Link href={'/'}>{team}</Link>
      </Paragraph>
      <Paragraph>{location}</Paragraph>
      <div css={[bottomContainer]}>
        <Button small primary>
          Contact
        </Button>
        <div css={[lastUpdatedContainer]}>
          <p>Last updated {lastModified}</p>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
