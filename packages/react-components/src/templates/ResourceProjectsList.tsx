import { FC, ComponentProps } from 'react';
import { ResourceProject } from '@asap-hub/model';

import { ResultList, ProjectCard } from '../organisms';
import { ProjectIcon } from '../icons';

type ResourceProjectsListProps = Omit<
  ComponentProps<typeof ResultList>,
  'children'
> & {
  readonly projects: ReadonlyArray<ResourceProject>;
};

const ResourceProjectsList: FC<ResourceProjectsListProps> = ({
  projects,
  ...cardListProps
}) => (
  <ResultList icon={<ProjectIcon />} {...cardListProps}>
    {projects.map((project) => (
      <ProjectCard key={project.id} {...project} />
    ))}
  </ResultList>
);

export default ResourceProjectsList;
