import { FC, ComponentProps } from 'react';

import { ResultList, ProjectCard } from '../organisms';

type DiscoveryProject = {
  readonly id: string;
  readonly title: string;
  readonly status: 'Active' | 'Complete' | 'Closed';
  readonly researchTheme: string;
  readonly teamName: string;
  readonly teamId?: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly duration: string;
  readonly tags: string[];
};

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
      <ProjectCard key={project.id} projectType="Discovery" {...project} />
    ))}
  </ResultList>
);

export default DiscoveryProjectsList;
