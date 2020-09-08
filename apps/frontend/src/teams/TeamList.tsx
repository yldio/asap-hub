import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { join } from 'path';
import {
  Paragraph,
  NetworkPage,
  NetworkTeam,
} from '@asap-hub/react-components';
import { useTeams } from '../api';

const Page: React.FC = () => {
  const { path, url } = useRouteMatch();
  const { loading, data: teams, error } = useTeams();

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (error) {
    return (
      <Paragraph>
        {error.name}
        {': '}
        {error.message}
      </Paragraph>
    );
  }
  if (teams) {
    return (
      <NetworkPage>
        <Switch>
          <Route path={`${path}/teams`}>
            <NetworkTeam teams={teams} />
          </Route>
          <Route path={`${path}/users`}>@todo: Users</Route>
          <Redirect to={join(url, 'teams')} />
        </Switch>
      </NetworkPage>
    );
  }

  return <Paragraph>No results</Paragraph>;
};

export default Page;
