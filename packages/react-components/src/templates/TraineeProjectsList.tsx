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

// Placeholder export function - will be replaced with actual implementation
/* istanbul ignore next */
const exportResults = () => Promise.resolve();

const TraineeProjectsList: FC<TraineeProjectsListProps> = ({
  projects,
  ...cardListProps
}) => (
  <ResultList
    icon={<ProjectIcon />}
    {...cardListProps}
    exportResults={exportResults}
  >
    {projects.map((project) => (
      <ProjectCard key={project.id} {...project} />
    ))}
  </ResultList>
);

export default TraineeProjectsList;
