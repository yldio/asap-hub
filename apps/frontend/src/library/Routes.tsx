import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { LibraryPage } from '@asap-hub/react-components';

import List from './List';

const Library: React.FC<{}> = () => {
  const { path } = useRouteMatch();
  const { search } = useLocation();
  const history = useHistory();
  const currentUrlParams = new URLSearchParams(search);

  const onChangeSearch = (newQuery: string) => {
    currentUrlParams.set('query', newQuery);
    history.replace({ search: currentUrlParams.toString() });
  };
  return (
    <Switch>
      <Route exact path={`${path}`}>
        <LibraryPage
          onChangeSearch={onChangeSearch}
          query={currentUrlParams.get('query') || ''}
        >
          <List />
        </LibraryPage>
      </Route>
    </Switch>
  );
};

export default Library;
