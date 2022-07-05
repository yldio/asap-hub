import { Frame, SearchFrame } from '@asap-hub/frontend-utils';
import {
  NotFoundPage,
  TeamProfilePage,
  NoEvents,
} from '@asap-hub/react-components';
import {
  ResearchOutputPermissionsContext,
  useFlags,
} from '@asap-hub/react-context';
import { events, network, useRouteParams } from '@asap-hub/routing';
import { FC, lazy, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { getEventListOptions } from '../../events/options';
import { useEvents } from '../../events/state';
import { usePaginationParams } from '../../hooks/pagination';
import { useCanCreateUpdateResearchOutput, useTeamById } from './state';

const loadAbout = () =>
  import(/* webpackChunkName: "network-team-about" */ './About');
const loadOutputs = () =>
  import(/* webpackChunkName: "network-team-outputs" */ './Outputs');
const loadWorkspace = () =>
  import(/* webpackChunkName: "network-team-workspace" */ './Workspace');

const loadTeamOutput = () =>
  import(/* webpackChunkName: "network-team-team-output" */ './TeamOutput');
const loadEvents = () =>
  import(/* webpackChunkName: "network-events" */ '../EventsEmbed');

const TeamOutput = lazy(loadTeamOutput);
const About = lazy(loadAbout);
const Outputs = lazy(loadOutputs);
const Workspace = lazy(loadWorkspace);
const Events = lazy(loadEvents);
loadAbout();

type TeamProfileProps = {
  currentTime: Date;
};

const TeamProfile: FC<TeamProfileProps> = ({ currentTime }) => {
  const route = network({}).teams({}).team;
  const [teamListElementId] = useState(`team-list-${uuid()}`);

  const { path } = useRouteMatch();
  const { teamId } = useRouteParams(route);

  const canCreateUpdate = useCanCreateUpdateResearchOutput([teamId]);

  const team = useTeamById(teamId);

  useEffect(() => {
    loadAbout()
      .then(team?.tools ? loadWorkspace : undefined)
      .then(loadOutputs)
      .then(loadTeamOutput);
  }, [team]);

  const { pageSize } = usePaginationParams();

  const upcomingEventOptions = getEventListOptions(
    currentTime,
    false,
    {
      pageSize,
    },
    { teamId },
  );

  const pastEventOptions = getEventListOptions(
    currentTime,
    true,
    {
      pageSize,
    },
    { teamId },
  );

  const upcomingEventsResult = useEvents(upcomingEventOptions);

  const pastEventsResult = useEvents(pastEventOptions);

  const isEventsEnabled = useFlags().isEnabled('EVENTS_SEARCH');

  if (team) {
    return (
      <ResearchOutputPermissionsContext.Provider value={{ canCreateUpdate }}>
        <Frame title={team.displayName}>
          <Switch>
            <Route path={path + route({ teamId }).createOutput.template}>
              <Frame title="Share Output">
                <TeamOutput teamId={teamId} />
              </Frame>
            </Route>
            <TeamProfilePage
              teamListElementId={teamListElementId}
              upcomingEventsCount={upcomingEventsResult.total}
              pastEventsCount={pastEventsResult.total}
              {...team}
            >
              <Route path={path + route({ teamId }).about.template}>
                <Frame title="About">
                  <About teamListElementId={teamListElementId} team={team} />
                </Frame>
              </Route>
              <Route path={path + route({ teamId }).outputs.template}>
                <SearchFrame title="outputs">
                  <Outputs teamId={teamId} />
                </SearchFrame>
              </Route>
              {team.tools && (
                <Route path={path + route({ teamId }).workspace.template}>
                  <Frame title="Workspace">
                    <Workspace team={{ ...team, tools: team.tools }} />
                  </Frame>
                </Route>
              )}
              {isEventsEnabled && (
                <Route path={path + route({ teamId }).upcoming.template}>
                  <Frame title="Upcoming Events">
                    <Events
                      constraint={{ teamId }}
                      currentTime={currentTime}
                      past={false}
                      events={upcomingEventsResult}
                      noEventsComponent={
                        <NoEvents
                          teamName={team.displayName}
                          type="team"
                          past={false}
                          link={events({}).upcoming({}).$}
                        />
                      }
                    />
                  </Frame>
                </Route>
              )}
              {isEventsEnabled && (
                <Route path={path + route({ teamId }).past.template}>
                  <Frame title="Past Events">
                    <Events
                      events={pastEventsResult}
                      constraint={{ teamId }}
                      currentTime={currentTime}
                      past={true}
                      noEventsComponent={
                        <NoEvents
                          teamName={team.displayName}
                          type="team"
                          past={true}
                          link={events({}).past({}).$}
                        />
                      }
                    />
                  </Frame>
                </Route>
              )}

              <Redirect to={route({ teamId }).about({}).$} />
            </TeamProfilePage>
          </Switch>
        </Frame>
      </ResearchOutputPermissionsContext.Provider>
    );
  }

  return <NotFoundPage />;
};

export default TeamProfile;
