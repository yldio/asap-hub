import { useRouteParams, gp2 } from '@asap-hub/routing';

import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ProjectDetailPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';

import { useProjectById } from './state';

const { projects } = gp2;
const projectDetail = () => {
  const { projectId } = useRouteParams(projects({}).project);
  const projectData = useProjectById(projectId);
  const backHref = useBackHref() ?? projects({}).$;
  if (projectData) {
    return (
      <ProjectDetailPage backHref={backHref} {...projectData}>
        <Switch>
          {/* <Route path={projects({}).project({ projectId }).$}>
            <Frame title="Overview">
              <ProjectOverview {...projectData} />
            </Frame>
          </Route> */}
          <Redirect to={projects({}).project({ projectId }).$} />
        </Switch>
      </ProjectDetailPage>
    );
  }
  return <NotFoundPage />;
};

export default projectDetail;
