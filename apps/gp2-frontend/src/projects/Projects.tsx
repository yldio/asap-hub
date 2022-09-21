import { ProjectsPage } from '@asap-hub/gp2-components';
import { FC } from 'react';
import { useProjectsState } from './state';

const Projects: FC<Record<string, never>> = () => {
  const projects = useProjectsState();
  console.log(projects);
  return <ProjectsPage projects={projects} />;
};

export default Projects;
