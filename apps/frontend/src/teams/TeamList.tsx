import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import {
  Paragraph,
  NetworkPage,
  NetworkTeam,
} from '@asap-hub/react-components';
import { join } from 'path';

import { useTeams } from '../api';

const Page: React.FC = () => {
  const { path, url } = useRouteMatch();
  const { loading, data: teamsData, error } = useTeams();

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
  if (teamsData) {
    const teams = teamsData.map((team) => ({
      ...team,
      teamProfileHref: join(url, team.id),
    }));
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
