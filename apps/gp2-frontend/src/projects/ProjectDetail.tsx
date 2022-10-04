import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import { ProjectDetailPage, ProjectOverview } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2, useRouteParams } from '@asap-hub/routing';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useProjectById } from './state';

const { projects } = gp2;
const ProjectDetail = () => {
  const { projectId } = useRouteParams(projects({}).project);
  const project = useProjectById(projectId);
  const backHref = useBackHref() ?? projects({}).$;
  if (project) {
    return (
      <ProjectDetailPage backHref={backHref} {...project}>
        <Switch>
          <Route path={projects({}).project({ projectId }).overview({}).$}>
            <Frame title="Overview">
              <ProjectOverview {...project} />
            </Frame>
          </Route>
          <Redirect to={projects({}).project({ projectId }).overview({}).$} />
        </Switch>
      </ProjectDetailPage>
    );
  }
  return <NotFoundPage />;
};

export default ProjectDetail;
