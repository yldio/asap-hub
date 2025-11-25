import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';
import {
  ProjectDetailPage,
  ProjectDetailAbout,
  NotFoundPage,
} from '@asap-hub/react-components';
import { projects } from '@asap-hub/routing';
import { TraineeProjectDetail as TraineeProjectDetailType } from '@asap-hub/model';
import { useProjectById } from './state';

type TraineeProjectDetailParams = {
  projectId: string;
};

const TraineeProjectDetail: FC<Record<string, never>> = () => {
  const { projectId } = useParams<TraineeProjectDetailParams>();
  const project = useProjectById(projectId);

  if (!project) {
    return <NotFoundPage />;
  }

  // Ensure we're working with a TraineeProjectDetail
  if (project.projectType !== 'Trainee Project') {
    return <NotFoundPage />;
  }

  // Cast to TraineeProjectDetail - API now returns full detail data
  const projectDetail = project as TraineeProjectDetailType;

  const route = projects({}).traineeProjects({}).traineeProject({ projectId });

  return (
    <Frame title={project?.title || ''}>
      <ProjectDetailPage
        {...projectDetail}
        pointOfContactEmail={projectDetail.contactEmail}
        aboutHref={route.about({}).$}
      >
        <ProjectDetailAbout
          {...projectDetail}
          pointOfContactEmail={projectDetail.contactEmail}
        />
      </ProjectDetailPage>
    </Frame>
  );
};

export default TraineeProjectDetail;
