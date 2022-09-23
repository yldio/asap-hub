import { Frame } from '@asap-hub/frontend-utils';
import { ProjectsPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { lazy, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

const loadProjects = () =>
  import(/* webpackChunkName: "project-list" */ './ProjectList');
const loadProjectDetail = () =>
  import(/* webpackChunkName: "project-detail" */ './ProjectDetail');

const Projects = lazy(loadProjects);
const ProjectDetail = lazy(loadProjectDetail);

const { projects } = gp2;
const Routes: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    loadProjects().then(loadProjectDetail);
  }, []);
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <ProjectsPage>
          <Frame title="Projects">
            <Projects />
          </Frame>
        </ProjectsPage>
      </Route>
      <Route path={path + projects({}).project.template}>
        <ProjectDetail />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
