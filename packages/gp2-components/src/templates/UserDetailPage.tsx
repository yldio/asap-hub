import { ComponentProps } from 'react';

import UserDetailHeader from '../organisms/UserDetailHeader';

type UserDetailPageProps = ComponentProps<typeof UserDetailHeader>;

const UserDetailPage: React.FC<UserDetailPageProps> = ({
  children,
  ...headerProps
}) => (
  <article>
    <UserDetailHeader {...headerProps} />
    <main>{children}</main>
  </article>
);

export default UserDetailPage;
