import { usersHeaderImage } from '../images';
import PageBanner from '../organism/PageBanner';

const props = {
  image: usersHeaderImage,
  title: 'User Directory',
  description:
    'Explore the directory to discover more about our GP2 members that make up the private network.',
};

const UsersPage: React.FC = () => (
  <article>
    <PageBanner {...props} />
  </article>
);

export default UsersPage;
