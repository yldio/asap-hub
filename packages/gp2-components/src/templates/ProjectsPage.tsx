import { mainStyles } from '../layout';
import ProjectsHeader from '../organisms/ProjectsHeader';

const ProjectsPage: React.FC = ({ children }) => (
  <article>
    <ProjectsHeader />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default ProjectsPage;
