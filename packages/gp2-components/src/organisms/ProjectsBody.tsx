import { gp2 } from '@asap-hub/model';
import {
  contentSidePaddingWithNavigation,
  Display,
  Paragraph,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { noProjectsIcon } from '../icons';
import ProjectCard from './ProjectCard';

const { largeDesktopScreen, mobileScreen, rem, vminLinearCalc } = pixels;
export type ProjectsBodyProps = {
  projects: gp2.ListProjectResponse;
};

const styles = css({
  padding: `${vminLinearCalc(
    mobileScreen,
    36,
    largeDesktopScreen,
    72,
    'px',
  )} ${contentSidePaddingWithNavigation()}`,

  display: 'grid',
  textAlign: 'center',

  [`@media (min-width: ${mobileScreen.width + 1}px)`]: {
    justifyItems: 'center',
  },
});

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
      <div css={styles}>
        <span>{noProjectsIcon}</span>
        <div>
          <Display styleAsHeading={3}>{'No projects available.'}</Display>
          <Paragraph accent="lead">
            {'When a GP2 admin creates a project, it will be listed here.'}
          </Paragraph>
        </div>
      </div>
    )}
  </article>
);

export default ProjectsBody;
