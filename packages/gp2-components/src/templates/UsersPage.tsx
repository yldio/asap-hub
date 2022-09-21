import { ComponentProps } from 'react';
import { usersHeaderImage } from '../images';
import PageBanner from '../organisms/PageBanner';
import UsersPageBody from '../organisms/UsersPageBody';

const bannerProps = {
  image: usersHeaderImage,
  position: 'top',
  title: 'User Directory',
  description:
    'Explore the directory to discover more about our GP2 members that make up the private network.',
};

type UserPageProps = ComponentProps<typeof UsersPageBody>;

const UsersPage: React.FC<UserPageProps> = (props) => (
  <article>
    <PageBanner {...bannerProps} />
    <main>
      <UsersPageBody {...props} />
    </main>
  </article>
);

export default UsersPage;
