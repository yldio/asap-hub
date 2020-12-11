import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { NewsAndEventsPage } from '@asap-hub/react-components';

import Frame from '../structure/Frame';

const loadNewsAndEventsList = () =>
  import(/* webpackChunkName: "news-and-events-list" */ './NewsAndEventsList');
const loadNewsOrEvent = () =>
  import(/* webpackChunkName: "news-or-event" */ './NewsOrEvent');
const NewsAndEventsList = React.lazy(loadNewsAndEventsList);
const NewsOrEventPage = React.lazy(loadNewsOrEvent);
loadNewsAndEventsList();

const NewsAndEvents: React.FC<{}> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <NewsAndEventsPage>
          <Frame>
            <NewsAndEventsList />
          </Frame>
        </NewsAndEventsPage>
      </Route>
      <Route path={`${path}/:id`} component={NewsOrEventPage} />
    </Switch>
  );
};

export default NewsAndEvents;
