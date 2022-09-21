import { ComponentProps } from 'react';
import ProjectsBody from '../organisms/ProjectsBody';
import ProjectsHeader from '../organisms/ProjectsHeader';

type ProjectsPageProps = ComponentProps<typeof ProjectsBody>;

const ProjectsPage: React.FC<ProjectsPageProps> = (props) => (
  <article>
    <ProjectsHeader />
    <main>
      <ProjectsBody {...props} />
    </main>
  </article>
);

export default ProjectsPage;
