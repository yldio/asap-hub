import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';
import {
  ProjectDetailPage,
  ProjectDetailAbout,
  NotFoundPage,
} from '@asap-hub/react-components';
import { projects } from '@asap-hub/routing';
import { DiscoveryProjectDetail as DiscoveryProjectDetailType } from '@asap-hub/model';
import { useProjectById } from './state';

type DiscoveryProjectDetailParams = {
  projectId: string;
};

const DiscoveryProjectDetail: FC<Record<string, never>> = () => {
  const { projectId } = useParams<DiscoveryProjectDetailParams>();
  const project = useProjectById(projectId);

  if (!project) {
    return <NotFoundPage />;
  }

  // Ensure we're working with a DiscoveryProjectDetail
  if (project.projectType !== 'Discovery Project') {
    return <NotFoundPage />;
  }

  // Cast to DiscoveryProjectDetail - API now returns full detail data
  const projectDetail = project as DiscoveryProjectDetailType;

  const route = projects({})
    .discoveryProjects({})
    .discoveryProject({ projectId });

  return (
    <Frame title={project?.title || ''}>
      <ProjectDetailPage
        {...projectDetail}
        pointOfContactEmail={projectDetail.contactEmail || undefined}
        aboutHref={route.about({}).$}
      >
        <ProjectDetailAbout
          {...projectDetail}
          pointOfContactEmail={projectDetail.contactEmail || undefined}
        />
      </ProjectDetailPage>
    </Frame>
  );
};

export default DiscoveryProjectDetail;
