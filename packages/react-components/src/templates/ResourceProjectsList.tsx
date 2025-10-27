import { FC, ComponentProps } from 'react';

import { ResultList, ProjectCard } from '../organisms';

type ProjectMember = {
  readonly id: string;
  readonly displayName: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatarUrl?: string;
  readonly email?: string;
  readonly alumniSinceDate?: string;
  readonly href: string;
};

type ResourceProject = {
  readonly id: string;
  readonly title: string;
  readonly status: 'Active' | 'Complete' | 'Closed';
  readonly resourceType: string;
  readonly teamName?: string;
  readonly teamId?: string;
  readonly members?: ReadonlyArray<ProjectMember>;
  readonly startDate: string;
  readonly endDate: string;
  readonly duration: string;
  readonly tags: string[];
  readonly googleDriveLink?: string;
  readonly isTeamBased: boolean;
};

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
      <ProjectCard key={project.id} projectType="Resource" {...project} />
    ))}
  </ResultList>
);

export default ResourceProjectsList;
