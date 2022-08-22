import { Frame, SearchFrame } from '@asap-hub/frontend-utils';
import {
  NotFoundPage,
  TeamProfilePage,
  NoEvents,
} from '@asap-hub/react-components';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
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
const loadEventsList = () =>
  import(/* webpackChunkName: "network-events" */ '../EventsEmbedList');

const TeamOutput = lazy(loadTeamOutput);
const About = lazy(loadAbout);
const Outputs = lazy(loadOutputs);
const Workspace = lazy(loadWorkspace);
const EventsList = lazy(loadEventsList);
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

  const upcomingEventsResult = useEvents(
    getEventListOptions(currentTime, {
      past: false,
      pageSize,
      constraint: { teamId },
    }),
  );

  const pastEventsResult = useEvents(
    getEventListOptions(currentTime, {
      past: true,
      pageSize,
      constraint: { teamId },
    }),
  );

  const sharedOutputsCount = team.outputs?.length || 0;

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
              sharedOutputsCount={sharedOutputsCount}
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
              <Route path={path + route({ teamId }).upcoming.template}>
                <Frame title="Upcoming Events">
                  <EventsList
                    constraint={{ teamId }}
                    currentTime={currentTime}
                    past={false}
                    events={upcomingEventsResult}
                    noEventsComponent={
                      <NoEvents
                        displayName={team.displayName}
                        type="team"
                        past={false}
                        link={events({}).upcoming({}).$}
                      />
                    }
                  />
                </Frame>
              </Route>
              <Route path={path + route({ teamId }).past.template}>
                <Frame title="Past Events">
                  <EventsList
                    events={pastEventsResult}
                    constraint={{ teamId }}
                    currentTime={currentTime}
                    past={true}
                    noEventsComponent={
                      <NoEvents
                        displayName={team.displayName}
                        type="team"
                        past={true}
                        link={events({}).past({}).$}
                      />
                    }
                  />
                </Frame>
              </Route>
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
