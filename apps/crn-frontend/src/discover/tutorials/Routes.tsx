import { FC, lazy, useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { tutorials } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';

const loadTutorial = () =>
  import(/* webpackChunkName: "tutorials-details-page" */ './Tutorial');
const TutorialDetailsPage = lazy(loadTutorial);

const News: FC<Record<string, never>> = () => {
  const { path } = useRouteMatch();
  useEffect(() => {
    loadTutorial();
  });

  return (
    <Switch>
      <Route path={path + tutorials({}).article.template}>
        <Frame title={null}>
          <TutorialDetailsPage />
        </Frame>
      </Route>
    </Switch>
  );
};

export default News;
