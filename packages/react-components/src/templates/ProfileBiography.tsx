import React from 'react';
import { Card, Headline2, Button, Paragraph } from '../atoms';
import { Container } from '../molecules';

type ProfileProps = {
  readonly biography: string;
};

const Profile: React.FC<ProfileProps> = ({ biography }) => {
  return (
    <Container>
      <Card>
        <Headline2>Biography</Headline2>
        <Paragraph>{biography}</Paragraph>
        <Button>View Biosketch</Button>
      </Card>
    </Container>
  );
};

export default Profile;
