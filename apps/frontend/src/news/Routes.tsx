import { FC, lazy } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { NewsAndEventsPage } from '@asap-hub/react-components';
import { news } from '@asap-hub/routing';

import Frame from '../structure/Frame';

const loadNewsAndEventsList = () =>
  import(/* webpackChunkName: "news-and-events-list" */ './NewsAndEventsList');
const loadNewsOrEvent = () =>
  import(/* webpackChunkName: "news-or-event" */ './NewsOrEvent');
const NewsAndEventsList = lazy(loadNewsAndEventsList);
const NewsOrEventPage = lazy(loadNewsOrEvent);
loadNewsAndEventsList();

const NewsAndEvents: FC<Record<string, never>> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <NewsAndEventsPage>
          <Frame title={null}>
            <NewsAndEventsList />
          </Frame>
        </NewsAndEventsPage>
      </Route>
      <Route path={path + news({}).article.template}>
        <NewsOrEventPage />
      </Route>
    </Switch>
  );
};

export default NewsAndEvents;
