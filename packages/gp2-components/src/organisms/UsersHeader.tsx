import { usersHeaderImage } from '../images';
import PageBanner from './PageBanner';

const props = {
  image: usersHeaderImage,
  position: 'top',
  title: 'User Directory',
  description:
    'Explore the directory to discover more about our GP2 members that make up the private network.',
};

const UsersHeader: React.FC = () => <PageBanner {...props} />;

export default UsersHeader;
