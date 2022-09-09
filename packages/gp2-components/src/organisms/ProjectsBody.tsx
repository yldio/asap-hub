import { gp2 } from '@asap-hub/model';
import { drawerQuery, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import ProjectCard from './ProjectCard';

const { perRem } = pixels;
type ProjectsBodyProps = {
  projects: gp2.ListProjectResponse;
};
const gridContainerStyles = css({
  display: 'grid',
  gridGap: `${24 / perRem}em`,
  gridTemplateColumns: '1fr 1fr',
  marginTop: `${48 / perRem}em`,

  [drawerQuery]: {
    gridTemplateColumns: '1fr',
  },
});

const ProjectsBody: React.FC<ProjectsBodyProps> = ({ projects }) => (
  <article css={gridContainerStyles}>
    {projects.items.map((project) => (
      <ProjectCard key={project.id} {...project} />
    ))}
  </article>
);

export default ProjectsBody;
