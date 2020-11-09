import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import ProfileHeader from './ProfileHeader';
import { steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';

const styles = css({
  alignSelf: 'stretch',
});

const contentStyles = css({
  borderTop: `1px solid ${steel.rgb}`,
  padding: `0 ${contentSidePaddingWithNavigation(10)}`,
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
