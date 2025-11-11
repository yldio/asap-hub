import { ComponentProps } from 'react';

import UserProfileHeader from './UserProfileHeader';
import PageContraints from './PageConstraints';

type UserProfilePageProps = ComponentProps<typeof UserProfileHeader> & {
  children: React.ReactNode;
};

const UserProfilePage: React.FC<UserProfilePageProps> = ({
  children,
  ...profile
}) => (
  <article>
    <UserProfileHeader {...profile} />
    <PageContraints as="main">{children}</PageContraints>
  </article>
);

export default UserProfilePage;
