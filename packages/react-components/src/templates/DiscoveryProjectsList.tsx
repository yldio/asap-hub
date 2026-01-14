import { FC, ComponentProps } from 'react';
import { DiscoveryProject } from '@asap-hub/model';

import { ResultList, ProjectCard } from '../organisms';
import { ProjectIcon } from '../icons';

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
  <ResultList icon={<ProjectIcon />} {...cardListProps}>
    {projects.map((project) => (
      <ProjectCard key={project.id} {...project} />
    ))}
  </ResultList>
);

export default DiscoveryProjectsList;
