import { projectsImage } from '../images';

import PageBanner from '../organisms/PageBanner';
import ProjectCard from '../organisms/ProjectCard';

const props = {
  image: projectsImage,
  position: 'center',
  title: 'Project Directory',
  description:
    'Explore past and present GP2 projects being carried out by teams within the network and discover open opportunities to join them.',
};

const projectProps = {
  title: 'project title',
  status: 'Active',
  startDate: '',
  endDate: '',
  members: [],
};

const ProjectsPage: React.FC = () => (
  <article>
    <PageBanner {...props} />
    <main>
      <ProjectCard {...projectProps}></ProjectCard>
    </main>
  </article>
);

export default ProjectsPage;
