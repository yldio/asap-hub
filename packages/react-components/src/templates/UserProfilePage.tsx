import { ComponentProps } from 'react';

import UserProfileHeader from './UserProfileHeader';
import PageConstraints from './PageConstraints';

type UserProfilePageProps = ComponentProps<typeof UserProfileHeader> & {
  children: React.ReactNode;
};

const UserProfilePage: React.FC<UserProfilePageProps> = ({
  children,
  ...profile
}) => (
  <article>
    <UserProfileHeader {...profile} />
    <PageConstraints as="main">{children}</PageConstraints>
  </article>
);

export default UserProfilePage;
