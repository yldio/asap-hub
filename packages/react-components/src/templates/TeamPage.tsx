import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { TeamHeader } from '../templates';
import { perRem } from '../pixels';

const styles = css({
  alignSelf: 'stretch',
  paddingTop: `${36 / perRem}em`,
});

type TeamPageProps = ComponentProps<typeof TeamHeader> & {
  children: React.ReactNode;
};

const TeamPage: React.FC<TeamPageProps> = ({ children, ...profile }) => {
  return (
    <article css={styles}>
      <TeamHeader {...profile} />
      {children}
    </article>
  );
};

export default TeamPage;
