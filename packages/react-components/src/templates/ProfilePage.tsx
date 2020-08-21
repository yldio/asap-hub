import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import ProfileHeader from './ProfileHeader';
import { perRem } from '../pixels';

const styles = css({
  alignSelf: 'stretch',
  paddingTop: `${36 / perRem}em`,
});

type ProfilePageProps = ComponentProps<typeof ProfileHeader> & {
  children: React.ReactNode;
};

const ProfilePage: React.FC<ProfilePageProps> = ({ children, ...profile }) => {
  return (
    <article css={styles}>
      <ProfileHeader {...profile} />
      {children}
    </article>
  );
};

export default ProfilePage;
