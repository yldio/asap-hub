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
  id: '42',
  title: 'A Project',
  startDate: '2020-07-06',
  endDate: '2021-12-28',
  status: 'Completed',
  projectProposalUrl: 'http://a-proposal',
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
