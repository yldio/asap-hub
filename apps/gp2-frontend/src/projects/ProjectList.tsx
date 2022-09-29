import { ProjectsBody } from '@asap-hub/gp2-components';
import { FC } from 'react';
import { useProjectsState } from './state';

const ProjectList: FC<Record<string, never>> = () => {
  const projects = useProjectsState();
  return <ProjectsBody projects={projects} />;
};

export default ProjectList;
