import { projectsImage } from '../images';
import PageBanner from '../organisms/PageBanner';

const props = {
  imageAndPosition: {
    image: projectsImage,
    backgroundPosition: 'center',
  },
  title: 'Project Directory',
  description:
    'Explore past and present GP2 projects being carried out by teams within the network and discover open opportunities to join them.',
};

const ProjectsPage: React.FC = () => (
  <article>
    <PageBanner {...props} />
  </article>
);

export default ProjectsPage;
