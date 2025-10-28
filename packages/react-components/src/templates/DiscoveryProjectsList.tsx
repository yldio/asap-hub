import { FC, ComponentProps } from 'react';
import { DiscoveryProject } from '@asap-hub/model';

import { ResultList, ProjectCard } from '../organisms';

type DiscoveryProjectsListProps = Omit<
  ComponentProps<typeof ResultList>,
  'children'
> & {
  readonly projects: ReadonlyArray<DiscoveryProject>;
};

const DiscoveryProjectsList: FC<DiscoveryProjectsListProps> = ({
  projects,
  ...cardListProps
}) => (
  <ResultList {...cardListProps} exportResults={() => Promise.resolve()}>
    {projects.map((project) => (
      <ProjectCard key={project.id} {...project} />
    ))}
  </ResultList>
);

export default DiscoveryProjectsList;
