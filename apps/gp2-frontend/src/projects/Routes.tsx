import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { lazy, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

const loadProjects = () =>
  import(/* webpackChunkName: "working-groups-list" */ './Projects');
// const loadProjectDetail = () =>
//   import(/* webpackChunkName: "working-groups-detail" */ './ProjectDetail');

const Projects = lazy(loadProjects);
// const ProjectDetail = lazy(loadProjectDetail);

const { projects } = gp2;
const Routes: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    loadProjects(); //.then(loadProjectDetail);
  }, []);
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Projects />
      </Route>
      {/* <Route path={path + projects({}).project.template}>
        <ProjectDetail />
      </Route> */}
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
