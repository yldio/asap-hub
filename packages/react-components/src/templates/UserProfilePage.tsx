import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import UserProfileHeader from './UserProfileHeader';
import { steel } from '../colors';
import { networkPageLayoutPaddingStyle } from '../layout';

const contentStyles = css({
  borderTop: `1px solid ${steel.rgb}`,
  padding: networkPageLayoutPaddingStyle,
});

type UserProfilePageProps = ComponentProps<typeof UserProfileHeader> & {
  children: React.ReactNode;
};

const UserProfilePage: React.FC<UserProfilePageProps> = ({
  children,
  ...profile
}) => (
  <article>
    <UserProfileHeader {...profile} />
    <main css={contentStyles}>{children}</main>
  </article>
);

export default UserProfilePage;
