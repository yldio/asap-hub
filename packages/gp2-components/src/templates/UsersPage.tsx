import { usersHeaderImage } from '../images';
import UsersPageBody from '../organisms/UsersPageBody';
import PageBanner from '../organisms/PageBanner';
import { ComponentProps } from 'react';

const bannerProps = {
  image: usersHeaderImage,
  position: 'top',
  title: 'User Directory',
  description:
    'Explore the directory to discover more about our GP2 members that make up the private network.',
};

const UsersPage: React.FC<ComponentProps<typeof UsersPageBody>> = ({
  users,
}) => (
  <article>
    <PageBanner {...bannerProps} />
    <main>
      <UsersPageBody users={users} />
    </main>
  </article>
);

export default UsersPage;
