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
import { TeamTool, ResearchOutputType } from '@asap-hub/model';

const PROPOSAL_PUBLISH_DATE = '2020-10-09T23:00:00.000Z';

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

  const { loading, data: team, patch } = useTeamById(id);

  useEffect(() => {
    loadAbout()
      .then(team?.tools ? loadWorkspace : undefined)
      .then(loadOutputs);
  }, [team]);

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }
  if (team) {
    const teamProps = {
      ...team,
      tools: team.tools
        ? team.tools.map((tool, index) => ({
          ...tool,
          href: join(url, 'workspace', 'tools', index.toString()),
        }))
        : undefined,
    };
    const teamPageProps = {
      ...teamProps,
      aboutHref: join(url, 'about'),
      outputsHref: join(url, 'outputs'),
      workspaceHref: join(url, 'workspace'),
    };

    const outputs = teamPageProps.proposalURL
      ? [
        {
          id: teamPageProps.proposalURL,
          publishDate: PROPOSAL_PUBLISH_DATE,
          created: PROPOSAL_PUBLISH_DATE,
          title: teamPageProps.projectTitle,
          type: 'Proposal' as ResearchOutputType,
          href: join('/shared-research/', teamPageProps.proposalURL),
          team: {
            id: teamPageProps.id,
            displayName: teamPageProps.displayName,
            href: join('/network/teams', teamPageProps.id),
          },
        },
      ]
      : [];

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
                <Outputs outputs={outputs} />
              </Route>
              {teamProps.tools && (
                <Route path={`${path}/workspace`}>
                  <Workspace
                    {...teamProps}
                    tools={teamProps.tools}
                    newToolHref={join(url, 'workspace', 'tools')}
                  />
                  <Route exact path={`${path}/workspace/tools`}>
                    <ToolModal
                      title="Add Link"
                      backHref={join(url, 'workspace')}
                      onSave={(data: TeamTool) =>
                        patch({ tools: [...(team.tools ?? []), data] })
                      }
                    />
                  </Route>
                  {teamProps.tools.map((tool, i) => (
                    <Route
                      key={`tool-${i}`}
                      path={`${path}/workspace/tools/${i}`}
                    >
                      <ToolModal
                        {...tool}
                        title="Edit Link"
                        backHref={join(url, 'workspace')}
                        onSave={(data: TeamTool) =>
                          patch({
                            tools: Object.assign([], team.tools, { [i]: data }),
                          })
                        }
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
