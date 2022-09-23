import { ComponentProps } from 'react';
import ProjectsBody from '../organisms/ProjectsBody';
import ProjectsHeader from '../organisms/ProjectsHeader';

type ProjectsPageProps = ComponentProps<typeof ProjectsBody>;

const ProjectsPage: React.FC<ProjectsPageProps> = ({ children }) => (
  <article>
    <ProjectsHeader />
    <main>{children}</main>
  </article>
);

export default ProjectsPage;
