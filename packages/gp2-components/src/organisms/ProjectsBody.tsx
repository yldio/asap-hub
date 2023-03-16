import { gp2 } from '@asap-hub/model';
import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { noProjectsIcon } from '../icons';
import { EmptyState } from '../molecules';
import ProjectCard from './ProjectCard';

const { rem } = pixels;
export type ProjectsBodyProps = {
  projects: gp2.ListProjectResponse;
};

const gridContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  rowGap: rem(24),
  marginTop: rem(48),
});

const ProjectsBody: React.FC<ProjectsBodyProps> = ({ projects }) => (
  <article>
    {projects.items.length ? (
      <div css={gridContainerStyles}>
        {projects.items.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    ) : (
      <EmptyState
        icon={noProjectsIcon}
        title={'No projects available.'}
        description={
          'When a GP2 admin creates a project, it will be listed here.'
        }
      />
    )}
  </article>
);

export default ProjectsBody;
