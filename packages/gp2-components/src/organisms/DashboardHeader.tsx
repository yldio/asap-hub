import { dashboardImage } from '../images';
import { PageBanner } from '../organisms';

const props = {
  image: dashboardImage,
  position: 'center',
  title: 'Dashboard',
  description:
    'Discover how to use the platform and what’s currently happening within the network at a glance.',
};

const WorkingGroupsHeader: React.FC = () => <PageBanner {...props} />;

export default WorkingGroupsHeader;
