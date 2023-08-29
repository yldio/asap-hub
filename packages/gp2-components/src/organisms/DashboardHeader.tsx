import { dashboardImage } from '../images';
import PageBanner from './PageBanner';

const props = {
  image: dashboardImage,
  position: 'center',
  title: 'Dashboard',
  description:
    'Discover how to use the platform and what’s currently happening within the network.',
};

const DashboardHeader: React.FC = () => <PageBanner {...props} />;

export default DashboardHeader;
