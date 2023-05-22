import {
  EditResourceModal,
  ResourceModal,
  WorkingGroupDetailPage,
  WorkingGroupOverview,
  WorkingGroupResources,
} from '@asap-hub/gp2-components';
import { gp2 as gp2Model } from '@asap-hub/model';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { FC, lazy, useEffect } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import EventsList from '../events/EventsList';
import { useUpcomingAndPastEvents } from '../events/state';
import Frame from '../Frame';
import OutputList from '../outputs/OutputList';
import { useOutputs } from '../outputs/state';
import { usePutWorkingGroupResources, useWorkingGroupById } from './state';

const { workingGroups } = gp2Routing;

const loadCreateWorkingGroupOutput = () =>
  import(
    /* webpackChunkName: "working-group-create-output-" */ './CreateWorkingGroupOutput'
  );

const CreateWorkingGroupOutput = lazy(loadCreateWorkingGroupOutput);
type WorkingGroupDetailProps = {
  currentTime: Date;
};
const WorkingGroupDetail: FC<WorkingGroupDetailProps> = ({ currentTime }) => {
  const { path } = useRouteMatch();
  const { workingGroupId } = useRouteParams(workingGroups({}).workingGroup);
  const workingGroup = useWorkingGroupById(workingGroupId);
  const { total: outputsTotal } = useOutputs({
    filter: { workingGroups: workingGroupId },
  });

  const currentUser = useCurrentUserGP2();
  const isWorkingGroupMember =
    workingGroup?.members.some(({ userId }) => userId === currentUser?.id) ||
    false;
  const isAdministrator = currentUser?.role === 'Administrator';
  const workingGroupRoute = workingGroups({}).workingGroup({ workingGroupId });
  const resourcesRoute = workingGroupRoute.workspace({});
  const createOutputRoute = workingGroupRoute.createOutput;
  const editRoute = resourcesRoute.edit({});
  const add = isAdministrator ? resourcesRoute.add({}).$ : undefined;
  const edit = isAdministrator ? editRoute.$ : undefined;
  const overview = workingGroupRoute.overview({}).$;
  const outputs = workingGroupRoute.outputs({}).$;
  const resources = resourcesRoute.$;
  const upcoming = workingGroupRoute.upcoming({}).$;
  const past = workingGroupRoute.past({}).$;

  const updateWorkingGroupResources =
    usePutWorkingGroupResources(workingGroupId);

  useEffect(() => {
    loadCreateWorkingGroupOutput();
  }, [workingGroup]);
  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(currentTime, {
    workingGroupId,
  });

  if (workingGroup) {
    return (
      <Switch>
        <Route exact path={path + createOutputRoute.template}>
          <Frame title="Create Output">
            <CreateWorkingGroupOutput />
          </Frame>
        </Route>
        <WorkingGroupDetailPage
          {...workingGroup}
          isWorkingGroupMember={isWorkingGroupMember}
          isAdministrator={isAdministrator}
          outputsTotal={outputsTotal}
          upcomingTotal={upcomingEvents?.total || 0}
          pastTotal={pastEvents?.total || 0}
        >
          <Switch>
            <Route path={overview}>
              <Frame title="Overview">
                <WorkingGroupOverview {...workingGroup} />
              </Frame>
            </Route>
            {isWorkingGroupMember && (
              <Route path={resources}>
                <Frame title="Resources">
                  <WorkingGroupResources
                    {...workingGroup}
                    add={add}
                    edit={edit}
                  />
                  {isAdministrator && (
                    <>
                      <Route path={add}>
                        <ResourceModal
                          modalTitle={'Add Resource'}
                          modalDescription={
                            'Select a resource type and provide the necessary information required to share a resource privately with your group.'
                          }
                          backHref={resources}
                          onSave={(resource: gp2Model.Resource) =>
                            updateWorkingGroupResources([
                              ...(workingGroup.resources || []),
                              resource,
                            ])
                          }
                        />
                      </Route>
                      <Route exact path={edit + editRoute.resource.template}>
                        <EditResourceModal
                          route={editRoute.resource}
                          resources={workingGroup.resources || []}
                          backHref={resources}
                          updateResources={updateWorkingGroupResources}
                        />
                      </Route>
                    </>
                  )}
                </Frame>
              </Route>
            )}
            <Route path={outputs}>
              <Frame title="Shared Outputs">
                <OutputList filters={{ workingGroups: workingGroupId }} />
              </Frame>
            </Route>
            <Route path={upcoming}>
              <Frame title="Upcoming Events">
                <EventsList
                  constraint={{ workingGroupId }}
                  currentTime={currentTime}
                  past={false}
                />
              </Frame>
            </Route>
            <Route path={past}>
              <Frame title="Past Events">
                <EventsList
                  currentTime={currentTime}
                  past={true}
                  constraint={{ workingGroupId }}
                />
              </Frame>
            </Route>
            <Redirect to={overview} />
          </Switch>
        </WorkingGroupDetailPage>
      </Switch>
    );
  }
  return <NotFoundPage />;
};

export default WorkingGroupDetail;
