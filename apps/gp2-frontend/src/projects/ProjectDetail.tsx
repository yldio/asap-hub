import { useRouteParams, gp2 } from '@asap-hub/routing';

import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import { Redirect, Route, Switch } from 'react-router-dom';
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
      <ProjectDetailPage backHref={backHref} {...projectData}>
        <Switch>
          <Route path={projects({}).project({ projectId }).overview({}).$}>
            <Frame title="Overview"></Frame>
          </Route>
          <Redirect to={projects({}).project({ projectId }).overview({}).$} />
        </Switch>
      </ProjectDetailPage>
    );
  }
  return <NotFoundPage />;
};

export default ProjectDetail;
