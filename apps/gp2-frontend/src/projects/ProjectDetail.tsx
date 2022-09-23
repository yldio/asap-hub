import { useRouteParams, gp2 } from '@asap-hub/routing';

import { useBackHref } from '@asap-hub/frontend-utils';
import { ProjectDetailPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';

import { useProjectById } from './state';

const { projects } = gp2;
const ProjectDetail = () => {
  const { projectId } = useRouteParams(projects({}).project);
  const projectData = useProjectById(projectId);
  const backHref = useBackHref() ?? projects({}).$;
  if (projectData) {
    return (
      <ProjectDetailPage
        backHref={backHref}
        {...projectData}
      ></ProjectDetailPage>
    );
  }
  return <NotFoundPage />;
};

export default ProjectDetail;
