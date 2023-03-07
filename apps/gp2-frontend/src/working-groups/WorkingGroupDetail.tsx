import { Frame } from '@asap-hub/frontend-utils';
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
import { Redirect, Route, Switch } from 'react-router-dom';
import { usePutWorkingGroupResources, useWorkingGroupById } from './state';

const { workingGroups } = gp2Routing;

const loadCreateWorkingGroupOutput = () =>
  import(
    /* webpackChunkName: "working-group-create-output-" */ './CreateWorkingGroupOutput'
  );

const CreateWorkingGroupOutput = lazy(loadCreateWorkingGroupOutput);

const WorkingGroupDetail: FC<Record<string, never>> = () => {
  const { workingGroupId } = useRouteParams(workingGroups({}).workingGroup);
  const workingGroup = useWorkingGroupById(workingGroupId);

  const currentUser = useCurrentUserGP2();
  const isWorkingGroupMember =
    workingGroup?.members.some(({ userId }) => userId === currentUser?.id) ||
    false;
  const isAdministrator = currentUser?.role === 'Administrator';
  const workingGroupRoute = workingGroups({}).workingGroup({ workingGroupId });
  const resourcesRoute = workingGroupRoute.resources({});
  const createOutputRoute = workingGroupRoute.createOutput;
  const editRoute = resourcesRoute.edit({});
  const add = isAdministrator ? resourcesRoute.add({}).$ : undefined;
  const edit = isAdministrator ? editRoute.$ : undefined;
  const overview = workingGroupRoute.overview({}).$;
  const resources = resourcesRoute.$;

  const updateWorkingGroupResources =
    usePutWorkingGroupResources(workingGroupId);

  useEffect(() => {
    loadCreateWorkingGroupOutput();
  }, [workingGroup]);

  if (workingGroup) {
    return (
      <Switch>
        <Route exact path={workingGroupRoute.$ + createOutputRoute.template}>
          <Frame title="Create Output">
            <CreateWorkingGroupOutput />
          </Frame>
        </Route>
        <WorkingGroupDetailPage
          {...workingGroup}
          isWorkingGroupMember={isWorkingGroupMember}
          isAdministrator={isAdministrator}
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
            <Redirect to={overview} />
          </Switch>
        </WorkingGroupDetailPage>
      </Switch>
    );
  }
  return <NotFoundPage />;
};

export default WorkingGroupDetail;
