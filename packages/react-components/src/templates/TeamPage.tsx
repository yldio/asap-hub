import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import TeamHeader from './TeamHeader';
import { perRem } from '../pixels';
import { steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';

const styles = css({
  alignSelf: 'stretch',
});
const contentStyles = css({
  borderTop: `1px solid ${steel.rgb}`,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type TeamPageProps = ComponentProps<typeof TeamHeader> & {
  children: React.ReactNode;
};

const TeamPage: React.FC<TeamPageProps> = ({ children, ...profile }) => {
  return (
    <article css={styles}>
      <TeamHeader {...profile} />
      <main css={contentStyles}>{children}</main>
    </article>
  );
};

export default TeamPage;
