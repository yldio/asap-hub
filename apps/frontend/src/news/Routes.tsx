import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { NewsAndEventsPage } from '@asap-hub/react-components';

import Frame from '../structure/Frame';

const loadBody = () =>
  import(/* webpackChunkName: "news-and-events-body" */ './Body');
const Body = React.lazy(loadBody);
loadBody();

const NewsAndEvents: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <NewsAndEventsPage>
          <Frame>
            <Body />
          </Frame>
        </NewsAndEventsPage>
      </Route>
    </Switch>
  );
};

export default NewsAndEvents;
