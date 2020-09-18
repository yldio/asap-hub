import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import ProfileHeader from './ProfileHeader';
import { perRem } from '../pixels';
import { pearl, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';

const styles = css({
  alignSelf: 'stretch',
  paddingTop: `${36 / perRem}em`,
});

const contentStyles = css({
  backgroundColor: pearl.rgb,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
  borderTop: `1px solid ${steel.rgb}`,
});

type ProfilePageProps = ComponentProps<typeof ProfileHeader> & {
  children: React.ReactNode;
};

const ProfilePage: React.FC<ProfilePageProps> = ({ children, ...profile }) => {
  return (
    <article css={styles}>
      <ProfileHeader {...profile} />
      <main css={contentStyles}>{children}</main>
    </article>
  );
};

export default ProfilePage;
