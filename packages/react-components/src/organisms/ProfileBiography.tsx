import React from 'react';
import css from '@emotion/css';

import { Card, Headline2, Button, Paragraph } from '../atoms';
import { docsIcon } from '../icons';
import { mobileScreen } from '../pixels';

const stretchOnMobile = css({
  display: 'flex',
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    flexDirection: 'column',
  },
});

type ProfileBiographyProps = {
  readonly biography: string;
};
const ProfileBiography: React.FC<ProfileBiographyProps> = ({ biography }) => {
  return (
    <Card>
      <Headline2 styleAsHeading={3}>Biography</Headline2>
      <Paragraph accent="lead">{biography}</Paragraph>
      <div css={stretchOnMobile}>
        <Button>
          {docsIcon}
          View Biosketch
        </Button>
      </div>
    </Card>
  );
};

export default ProfileBiography;
