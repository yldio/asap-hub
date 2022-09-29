import { usersHeaderImage } from '../images';
import PageBanner from '../organisms/PageBanner';

const bannerProps = {
  image: usersHeaderImage,
  position: 'top',
  title: 'User Directory',
  description:
    'Explore the directory to discover more about our GP2 members that make up the private network.',
};

const UsersPage: React.FC = ({ children }) => (
  <article>
    <PageBanner {...bannerProps} />
    <main>{children}</main>
  </article>
);

export default UsersPage;
