import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import {
  ProjectDetailPage,
  ProjectOverview,
  ProjectResources,
} from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2, useRouteParams } from '@asap-hub/routing';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useProjectById } from './state';

const { projects } = gp2;
const ProjectDetail = () => {
  const { projectId } = useRouteParams(projects({}).project);
  const project = useProjectById(projectId);
  const backHref = useBackHref() ?? projects({}).$;
  const currentUser = useCurrentUserGP2();
  const isProjectMember =
    project?.members.some(({ userId }) => userId === currentUser?.id) || false;

  const isAdministrator = false;
  if (project) {
    return (
      <ProjectDetailPage
        backHref={backHref}
        isProjectMember={isProjectMember}
        {...project}
      >
        <Switch>
          <Route path={projects({}).project({ projectId }).overview({}).$}>
            <Frame title="Overview">
              <ProjectOverview {...project} />
            </Frame>
          </Route>
          {isProjectMember && (
            <Route path={projects({}).project({ projectId }).resources({}).$}>
              <Frame title="Resources">
                <ProjectResources
                  {...project}
                  add={
                    projects({}).project({ projectId }).resources({}).add({}).$
                  }
                  isAdministrator={isAdministrator}
                />
              </Frame>
            </Route>
          )}
          <Redirect to={projects({}).project({ projectId }).overview({}).$} />
        </Switch>
      </ProjectDetailPage>
    );
  }
  return <NotFoundPage />;
};

export default ProjectDetail;
