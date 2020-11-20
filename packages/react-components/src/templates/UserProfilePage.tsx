import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import UserProfileHeader from './UserProfileHeader';
import { steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';

const styles = css({
  alignSelf: 'stretch',
});

const contentStyles = css({
  borderTop: `1px solid ${steel.rgb}`,
  padding: `0 ${contentSidePaddingWithNavigation(10)}`,
});

type UserProfilePageProps = ComponentProps<typeof UserProfileHeader> & {
  children: React.ReactNode;
};

const UserProfilePage: React.FC<UserProfilePageProps> = ({
  children,
  ...profile
}) => {
  return (
    <article css={styles}>
      <UserProfileHeader {...profile} />
      <main css={contentStyles}>{children}</main>
    </article>
  );
};

export default UserProfilePage;
