import { FC, ComponentProps } from 'react';
import { TraineeProject } from '@asap-hub/model';

import { ResultList, ProjectCard } from '../organisms';
import { ProjectIcon } from '../icons';

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
  <ResultList icon={<ProjectIcon />} {...cardListProps}>
    {projects.map((project) => (
      <ProjectCard key={project.id} {...project} />
    ))}
  </ResultList>
);

export default TraineeProjectsList;
