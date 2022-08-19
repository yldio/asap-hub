import { workingGroupsImage } from '../images';
import PageBanner from './PageBanner';

const props = {
  image: workingGroupsImage,
  title: 'Working Groups',
  description:
    'Groups of specialist GP2 members from a range of disciplines that are responsible for the operations and implementation of the programme.',
};

const WorkingGroupsHeader: React.FC = () => <PageBanner {...props} />;

export default WorkingGroupsHeader;
