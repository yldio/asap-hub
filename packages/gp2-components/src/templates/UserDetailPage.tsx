import { pixels } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { layoutContentStyles, mainStyles } from '../layout';

import UserDetailHeader from '../organisms/UserDetailHeader';

type UserDetailPageProps = ComponentProps<typeof UserDetailHeader>;

const { rem } = pixels;

const UserDetailPage: React.FC<UserDetailPageProps> = ({
  children,
  ...headerProps
}) => (
  <article css={layoutContentStyles}>
    <UserDetailHeader {...headerProps} />
    <main css={[mainStyles, { padding: `${rem(32)} 0` }]}>{children}</main>
  </article>
);

export default UserDetailPage;
