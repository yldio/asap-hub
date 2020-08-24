import React from 'react';
import css from '@emotion/css';

import { perRem, contentSidePaddingWithNavigation } from '../pixels';
import { pearl, steel } from '../colors';
import { Headline2, Headline3 } from '../atoms';

const styles = css({
  backgroundColor: pearl.rgb,
  borderTop: `1px solid ${steel.rgb}`,

  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

interface TeamAboutProps {
  readonly projectTitle: string;
}

const TeamAbout: React.FC<TeamAboutProps> = ({ projectTitle }) => (
  <main css={styles}>
    <Headline2 styleAsHeading={3}>Project Overview</Headline2>
    <Headline3 styleAsHeading={4}>{projectTitle}</Headline3>
  </main>
);

export default TeamAbout;
