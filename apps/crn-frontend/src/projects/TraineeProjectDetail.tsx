import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';
import {
  ProjectDetailPage,
  ProjectDetailAbout,
  NotFoundPage,
} from '@asap-hub/react-components';
import { projects } from '@asap-hub/routing';
import { useProjectById } from './state';

type TraineeProjectDetailParams = {
  projectId: string;
};

const TraineeProjectDetail: FC<Record<string, never>> = () => {
  const { projectId } = useParams<TraineeProjectDetailParams>();
  const projectDetail = useProjectById(projectId);

  if (!projectDetail) {
    return <NotFoundPage />;
  }

  // Ensure we're working with a TraineeProjectDetail
  if (projectDetail.projectType !== 'Trainee Project') {
    return <NotFoundPage />;
  }

  const route = projects({}).traineeProjects({}).traineeProject({ projectId });

  return (
    <Frame title={projectDetail?.title || ''}>
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
