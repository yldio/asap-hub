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

type ResourceProjectDetailParams = {
  projectId: string;
};

const ResourceProjectDetail: FC<Record<string, never>> = () => {
  const { projectId } = useParams<ResourceProjectDetailParams>();
  const projectDetail = useProjectById(projectId ?? '');

  if (!projectDetail) {
    return <NotFoundPage />;
  }

  // Ensure we're working with a ResourceProjectDetail
  if (projectDetail.projectType !== 'Resource Project') {
    return <NotFoundPage />;
  }

  const route = projects({})
    .resourceProjects({})
    .resourceProject({ projectId: projectId ?? '' });

  return (
    <Frame title={projectDetail?.title || ''}>
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

export default ResourceProjectDetail;
