import { ProjectsPage } from '@asap-hub/gp2-components';
import { Loading, NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router';
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
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  params.delete('searchQuery');
  const frameKey = params.toString();
  return (
    <Suspense key={pathname} fallback={<Loading />}>
      <Routes>
        <Route
          index
          element={
            <ProjectsPage>
              <Frame key={frameKey} title="Projects">
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
    </Suspense>
  );
};

export default RoutesComponent;
