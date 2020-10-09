import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { LibraryPage } from '@asap-hub/react-components';
import { useDebounce } from 'use-debounce';

import List from './List';
import ResearchOutput from './ResearchOutput';

const Library: React.FC<{}> = () => {
  const { path } = useRouteMatch();
  const { search } = useLocation();
  const history = useHistory();
  const currentUrlParams = new URLSearchParams(search);
  let filters = currentUrlParams.getAll('filter');
  const searchQuery = currentUrlParams.get('searchQuery') || '';
  const [searchQueryDebounce] = useDebounce(searchQuery, 500);

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
    filters.forEach((f) => currentUrlParams.append('filter', f));
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
          <List searchQuery={searchQueryDebounce} filters={filters} />
        </LibraryPage>
      </Route>
      <Route path={`${path}/:id`}>
        <ResearchOutput />
      </Route>
    </Switch>
  );
};

export default Library;
