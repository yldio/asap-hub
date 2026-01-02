import { FC } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';
import {
  ProjectDetailPage,
  ProjectDetailAbout,
  NotFoundPage,
} from '@asap-hub/react-components';
import { projects } from '@asap-hub/routing';
import { useProjectById } from './state';

type DiscoveryProjectDetailParams = {
  projectId: string;
};

const DiscoveryProjectDetail: FC<Record<string, never>> = () => {
  const { projectId } = useParams<DiscoveryProjectDetailParams>();
  const projectDetail = useProjectById(projectId ?? '');

  if (!projectDetail) {
    return <NotFoundPage />;
  }

  // Ensure we're working with a DiscoveryProjectDetail
  if (projectDetail.projectType !== 'Discovery Project') {
    return <NotFoundPage />;
  }

  const route = projects({})
    .discoveryProjects({})
    .discoveryProject({ projectId: projectId ?? '' });

  return (
    <Frame title={projectDetail?.title || ''}>
      <ProjectDetailPage
        {...projectDetail}
        pointOfContactEmail={projectDetail.contactEmail || undefined}
        aboutHref={route.about({}).$}
      >
        <Routes>
          <Route
            path="about"
            element={
              <ProjectDetailAbout
                {...projectDetail}
                pointOfContactEmail={projectDetail.contactEmail || undefined}
              />
            }
          />
          <Route index element={<Navigate to="about" replace />} />
        </Routes>
      </ProjectDetailPage>
    </Frame>
  );
};

export default DiscoveryProjectDetail;
