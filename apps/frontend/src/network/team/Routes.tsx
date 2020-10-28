import React, { Suspense, useEffect } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { Paragraph, TeamPage, NotFoundPage } from '@asap-hub/react-components';
import { join } from 'path';

import { useTeamById } from '@asap-hub/frontend/src/api/teams';
import ErrorBoundary from '@asap-hub/frontend/src/errors/ErrorBoundary';

const loadAbout = () =>
  import(/* webpackChunkName: "network-team-about" */ './About');
const loadOutputs = () =>
  import(/* webpackChunkName: "network-team-outputs" */ './Outputs');
const About = React.lazy(loadAbout);
const Outputs = React.lazy(loadOutputs);
loadAbout();

const Team: React.FC<{}> = () => {
  useEffect(() => {
    loadAbout().then(loadOutputs);
  }, []);

  const {
    url,
    path,
    params: { id },
  } = useRouteMatch();

  const { loading, data: team } = useTeamById(id);

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (team) {
    const teamPageProps = {
      ...team,
      aboutHref: join(url, 'about'),
      outputsHref: join(url, 'outputs'),
    };

    return (
      <TeamPage {...teamPageProps}>
        <ErrorBoundary>
          <Suspense fallback="Loading...">
            <Switch>
              <Route path={`${path}/about`}>
                <About
                  {...team}
                  proposalHref={
                    team.proposalURL
                      ? join('/shared-research/', team.proposalURL)
                      : undefined
                  }
                />
              </Route>
              <Route path={`${path}/outputs`}>
                <Outputs />
              </Route>
              <Redirect to={join(url, 'about')} />
            </Switch>
          </Suspense>
        </ErrorBoundary>
      </TeamPage>
    );
  }

  return <NotFoundPage />;
};

export default Team;
