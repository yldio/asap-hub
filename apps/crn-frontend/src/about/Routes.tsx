import { SkeletonBodyFrame as Frame } from '@asap-hub/frontend-utils';
import { AboutPage } from '@asap-hub/react-components';
import { FC, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

const loadAbout = () => import(/* webpackChunkName: "about" */ './About');

const AboutBody = lazy(loadAbout);

const About: FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadAbout();
  }, []);

  const { pathname: path } = useLocation();

  return (
    <Routes>
      <Route
        path={path}
        element={
          <AboutPage>
            <Frame title="About ASAP">
              <AboutBody />
            </Frame>
          </AboutPage>
        }
      />
    </Routes>
  );
};

export default About;
