import { projectsImage } from '../images';
import PageBanner from './PageBanner';

const props = {
  image: projectsImage,
  position: 'center',
  title: 'Project Directory',
  description:
    'Explore past and present GP2 projects being carried out by teams within the network and discover open opportunities to join them.',
};

const ProjectsHeader: React.FC = () => <PageBanner {...props} />;

export default ProjectsHeader;
