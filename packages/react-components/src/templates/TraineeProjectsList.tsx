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

type TraineeProject = {
  readonly id: string;
  readonly title: string;
  readonly status: 'Active' | 'Complete' | 'Closed';
  readonly trainer: ProjectMember;
  readonly members: ReadonlyArray<ProjectMember>;
  readonly startDate: string;
  readonly endDate: string;
  readonly duration: string;
  readonly tags: string[];
};

type TraineeProjectsListProps = Omit<
  ComponentProps<typeof ResultList>,
  'children'
> & {
  readonly projects: ReadonlyArray<TraineeProject>;
};

const TraineeProjectsList: FC<TraineeProjectsListProps> = ({
  projects,
  ...cardListProps
}) => (
  <ResultList {...cardListProps} exportResults={() => Promise.resolve()}>
    {projects.map((project) => (
      <ProjectCard key={project.id} projectType="Trainee" {...project} />
    ))}
  </ResultList>
);

export default TraineeProjectsList;
