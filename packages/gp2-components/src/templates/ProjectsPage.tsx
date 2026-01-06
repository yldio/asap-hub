import { layoutContentStyles, mainStyles } from '../layout';
import ProjectsHeader from '../organisms/ProjectsHeader';

const ProjectsPage: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <article css={layoutContentStyles}>
    <ProjectsHeader />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default ProjectsPage;
