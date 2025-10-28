import { FC, ComponentProps } from 'react';
import { ResourceProject } from '@asap-hub/model';

import { ResultList, ProjectCard } from '../organisms';

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
  <ResultList {...cardListProps} exportResults={() => Promise.resolve()}>
    {projects.map((project) => (
      <ProjectCard key={project.id} {...project} />
    ))}
  </ResultList>
);

export default ResourceProjectsList;
