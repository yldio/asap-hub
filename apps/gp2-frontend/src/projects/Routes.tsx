import { ProjectsPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Frame from '../Frame';

const loadProjectDirectory = () =>
  import(/* webpackChunkName: "project-list" */ './ProjectDirectory');
const loadProjectDetail = () =>
  import(/* webpackChunkName: "project-detail" */ './ProjectDetail');

const ProjectDirectory = lazy(loadProjectDirectory);
const ProjectDetail = lazy(loadProjectDetail);

const { projects } = gp2;
const RoutesComponent: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadProjectDirectory().then(loadProjectDetail);
  }, []);

  const [currentTime] = useState(new Date());
  return (
    <Routes>
      <Route
        index
        element={
          <ProjectsPage>
            <Frame title="Projects">
              <ProjectDirectory />
            </Frame>
          </ProjectsPage>
        }
      />
      <Route
        path={`${projects({}).project.template}/*`}
        element={<ProjectDetail currentTime={currentTime} />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default RoutesComponent;
