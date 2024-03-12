import { workingGroupsImage } from '../images';
import { PageBanner } from '.';

const props = {
  image: workingGroupsImage,
  position: 'center',
  title: 'Working Groups',
  description:
    'Groups of specialist GP2 members from a range of disciplines that are responsible for the operations and implementation of the programme.',
};

const WorkingGroupsHeader: React.FC<React.PropsWithChildren> = ({ children }) => (
  <PageBanner {...props} children={children} noMarginBottom={true} />
);

export default WorkingGroupsHeader;
