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
import ResearchOutput from './ResearchOutput';

const Library: React.FC<{}> = () => {
  const { path } = useRouteMatch();
  const { search } = useLocation();
  const history = useHistory();
  const currentUrlParams = new URLSearchParams(search);
  const searchQuery = currentUrlParams.get('searchQuery') || '';
  let filters = currentUrlParams.getAll('filter');

  const onChangeSearch = (newQuery: string) => {
    currentUrlParams.set('searchQuery', newQuery);
    history.replace({ search: currentUrlParams.toString() });
  };
  const onChangeFilter = (filter: string) => {
    currentUrlParams.delete('filter');
    if (filters.includes(filter)) {
      filters = filters.filter((f) => f !== filter);
    } else {
      filters.push(filter);
    }
    filters.map((f) => currentUrlParams.append('filter', f));
    history.replace({ search: currentUrlParams.toString() });
  };

  return (
    <Switch>
      <Route exact path={`${path}`}>
        <LibraryPage
          onChangeSearch={onChangeSearch}
          searchQuery={searchQuery}
          onChangeFilter={onChangeFilter}
          filters={filters}
        >
          <List searchQuery={searchQuery} filters={filters} />
        </LibraryPage>
      </Route>
      <Route path={`${path}/:id`}>
        <ResearchOutput />
      </Route>
    </Switch>
  );
};

export default Library;
