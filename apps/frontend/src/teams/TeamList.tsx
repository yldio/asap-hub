import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import {
  Paragraph,
  NetworkPage,
  NetworkTeam,
} from '@asap-hub/react-components';
import { useTeams } from '../api';

const Page: React.FC = () => {
  const { path } = useRouteMatch();
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
          <Route exact path={path}>
            <NetworkTeam teams={teams} />
          </Route>
        </Switch>
      </NetworkPage>
    );
  }

  return <Paragraph>No results</Paragraph>;
};

export default Page;
