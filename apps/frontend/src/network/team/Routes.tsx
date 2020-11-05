import React, { Suspense, useEffect } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import {
  Paragraph,
  TeamPage,
  NotFoundPage,
  ToolModal,
} from '@asap-hub/react-components';
import { join } from 'path';

import { useTeamById } from '@asap-hub/frontend/src/api/teams';
import ErrorBoundary from '@asap-hub/frontend/src/errors/ErrorBoundary';

const loadAbout = () =>
  import(/* webpackChunkName: "network-team-about" */ './About');
const loadOutputs = () =>
  import(/* webpackChunkName: "network-team-outputs" */ './Outputs');
const loadWorkspace = () =>
  import(/* webpackChunkName: "network-team-workspace" */ './Workspace');
const About = React.lazy(loadAbout);
const Outputs = React.lazy(loadOutputs);
const Workspace = React.lazy(loadWorkspace);
loadAbout();

const Team: React.FC<{}> = () => {
  const {
    url,
    path,
    params: { id },
  } = useRouteMatch();

  const { loading, data: team } = useTeamById(id);

  useEffect(() => {
    loadAbout()
      .then(team?.tools ? loadWorkspace : undefined)
      .then(loadOutputs);
  }, [team]);

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (team) {
    const teamPageProps = {
      ...team,
      aboutHref: join(url, 'about'),
      outputsHref: join(url, 'outputs'),
      workspaceHref: join(url, 'workspace'),
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
              {team.tools && (
                <Route path={`${path}/workspace`}>
                  <Workspace
                    {...team}
                    tools={team.tools.map((tool, index) => ({
                      ...tool,
                      href: join(url, 'workspace', 'tools', index.toString()),
                    }))}
                    newToolHref={join(url, 'workspace', 'tools')}
                  />
                  <Route exact path={`${path}/workspace/tools`}>
                    <ToolModal
                      title="Add Link"
                      backHref={join(url, 'workspace')}
                    />
                  </Route>
                  {team.tools.map((tool, i) => (
                    <Route
                      key={`tool-${i}`}
                      path={`${path}/workspace/tools/${i}`}
                    >
                      <ToolModal
                        {...tool}
                        title="Edit Link"
                        backHref={join(url, 'workspace')}
                      />
                    </Route>
                  ))}
                </Route>
              )}
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
