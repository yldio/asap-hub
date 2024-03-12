import { SkeletonBodyFrame as Frame } from '@asap-hub/frontend-utils';
import { AboutPage } from '@asap-hub/react-components';
import { FC, lazy, useEffect } from 'react';
import { Route, Routes, useRouteMatch } from 'react-router-dom';

const loadAbout = () => import(/* webpackChunkName: "about" */ './About');

const AboutBody = lazy(loadAbout);

const About: FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadAbout();
  }, []);

  const { path } = useRouteMatch();

  return (
    <Routes>
      <Route exact path={path}>
        <AboutPage>
          <Frame title="About ASAP">
            <AboutBody />
          </Frame>
        </AboutPage>
      </Route>
    </Routes>
  );
};

export default About;
