import { ProjectsPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { ComponentProps, lazy, useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Frame from '../Frame';

const loadProjectList = () =>
  import(/* webpackChunkName: "project-list" */ './ProjectList');
const loadProjectDetail = () =>
  import(/* webpackChunkName: "project-detail" */ './ProjectDetail');

const ProjectList = lazy(loadProjectList);
const ProjectDetail = lazy(loadProjectDetail);

type ProjectsProps = Pick<
  ComponentProps<typeof ProjectDetail>,
  'setBannerMessage'
>;

const { projects } = gp2;
const Routes: React.FC<ProjectsProps> = ({ setBannerMessage }) => {
  useEffect(() => {
    loadProjectList().then(loadProjectDetail);
  }, []);
  const { path } = useRouteMatch();

  const [currentTime] = useState(new Date());
  return (
    <Switch>
      <Route exact path={path}>
        <ProjectsPage>
          <Frame title="Projects">
            <ProjectList />
          </Frame>
        </ProjectsPage>
      </Route>
      <Route path={path + projects({}).project.template}>
        <ProjectDetail
          currentTime={currentTime}
          setBannerMessage={setBannerMessage}
        />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
