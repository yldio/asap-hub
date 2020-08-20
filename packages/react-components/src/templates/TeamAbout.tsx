import React from 'react';
import css from '@emotion/css';

import { perRem, contentSidePaddingWithNavigation } from '../pixels';
import { pearl, steel } from '../colors';

const styles = css({
  backgroundColor: pearl.rgb,
  borderTop: `1px solid ${steel.rgb}`,

  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

interface TeamAboutProps {}

const TeamAbout: React.FC<TeamAboutProps> = ({}) => (
  <main css={styles}>About</main>
);

export default TeamAbout;
