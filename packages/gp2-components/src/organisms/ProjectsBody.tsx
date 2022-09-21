import { gp2 } from '@asap-hub/model';
import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import ProjectCard from './ProjectCard';

const { rem } = pixels;
type ProjectsBodyProps = {
  projects: gp2.ListProjectResponse;
};
const gridContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  rowGap: rem(24),
  marginTop: rem(48),
});

const ProjectsBody: React.FC<ProjectsBodyProps> = ({ projects }) => (
  <article css={gridContainerStyles}>
    {projects.items.map((project) => (
      <ProjectCard key={project.id} {...project} />
    ))}
  </article>
);

export default ProjectsBody;
