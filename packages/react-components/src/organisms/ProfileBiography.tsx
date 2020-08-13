import React from 'react';

import { Card, Headline2, Button, Paragraph } from '../atoms';
import { docsIcon } from '../icons';

type ProfileBiographyProps = {
  readonly biography: string;
};
const ProfileBiography: React.FC<ProfileBiographyProps> = ({ biography }) => {
  return (
    <Card>
      <Headline2>Biography</Headline2>
      <Paragraph>{biography}</Paragraph>
      <Button>
        {docsIcon}
        View Biosketch
      </Button>
    </Card>
  );
};

export default ProfileBiography;
