import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';
import {
  ProjectDetailPage,
  ProjectDetailAbout,
  NotFoundPage,
} from '@asap-hub/react-components';
import { projects } from '@asap-hub/routing';
import { ResourceProjectDetail as ResourceProjectDetailType } from '@asap-hub/model';
import { useProjectById } from './state';

type ResourceProjectDetailParams = {
  projectId: string;
};

const ResourceProjectDetail: FC<Record<string, never>> = () => {
  const { projectId } = useParams<ResourceProjectDetailParams>();
  const project = useProjectById(projectId);

  if (!project) {
    return <NotFoundPage />;
  }

  // Ensure we're working with a ResourceProjectDetail
  if (project.projectType !== 'Resource Project') {
    return <NotFoundPage />;
  }

  // Cast to ResourceProjectDetail - API now returns full detail data
  const projectDetail = project as ResourceProjectDetailType;

  const route = projects({})
    .resourceProjects({})
    .resourceProject({ projectId });

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

export default ResourceProjectDetail;
