import ProjectsHeader from '../organisms/ProjectsHeader';

const ProjectsPage: React.FC = ({ children }) => (
  <article>
    <ProjectsHeader />
    <main>{children}</main>
  </article>
);

export default ProjectsPage;
