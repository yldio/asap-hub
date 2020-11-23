import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import TeamProfileHeader from './TeamProfileHeader';
import { perRem } from '../pixels';
import { steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';

const styles = css({
  alignSelf: 'stretch',
});
const contentStyles = css({
  borderTop: `1px solid ${steel.rgb}`,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(10)}`,
});

type TeamProfilePageProps = ComponentProps<typeof TeamProfileHeader> & {
  children: React.ReactNode;
};

const TeamProfilePage: React.FC<TeamProfilePageProps> = ({
  children,
  ...profile
}) => {
  return (
    <article css={styles}>
      <TeamProfileHeader {...profile} />
      <main css={contentStyles}>{children}</main>
    </article>
  );
};

export default TeamProfilePage;
