import { FC, lazy, useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { AboutPage } from '@asap-hub/react-components';
import { Frame } from '@asap-hub/frontend-utils';

const loadAbout = () => import(/* webpackChunkName: "about" */ './About');

const AboutBody = lazy(loadAbout);

const About: FC<Record<string, never>> = () => {
  useEffect(() => {
    loadAbout();
  }, []);

  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <AboutPage>
          <Frame title="About ASAP">
            <AboutBody />
          </Frame>
        </AboutPage>
      </Route>
    </Switch>
  );
};

export default About;
