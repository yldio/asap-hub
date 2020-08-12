import React from 'react';
import css from '@emotion/css';

import { Card, Headline2, Button, Paragraph } from '../atoms';
import { docsIcon } from '../icons';
import { contentSidePaddingWithNavigation } from '../pixels';

const containerStyles = css({
  padding: `24px ${contentSidePaddingWithNavigation(8)}`,
});

type ProfileProps = {
  readonly biography: string;
};
const Profile: React.FC<ProfileProps> = ({ biography }) => {
  return (
    <section css={containerStyles}>
      <Card>
        <Headline2>Biography</Headline2>
        <Paragraph>{biography}</Paragraph>
        <Button>
          {docsIcon}
          View Biosketch
        </Button>
      </Card>
    </section>
  );
};

export default Profile;
