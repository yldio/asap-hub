import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import {
  ResourceModal,
  WorkingGroupDetailPage,
  WorkingGroupOverview,
  WorkingGroupResources,
} from '@asap-hub/gp2-components';
import { gp2 as gp2Model } from '@asap-hub/model';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { Redirect, Route, Switch } from 'react-router-dom';
import EditResource from './EditResource';
import { usePutWorkingGroupResources, useWorkingGroupById } from './state';

const { workingGroups } = gp2Routing;

const modalInfo = {
  title: 'Add Resource',
  description:
    'Select a resource type and provide the neccessary information required to share a resource privately with your group.',
};

const WorkingGroupDetail = () => {
  const { workingGroupId } = useRouteParams(workingGroups({}).workingGroup);
  const workingGroup = useWorkingGroupById(workingGroupId);
  const backHref = useBackHref() ?? workingGroups({}).$;
  const currentUser = useCurrentUserGP2();
  const isWorkingGroupMember =
    workingGroup?.members.some(({ userId }) => userId === currentUser?.id) ||
    false;
  const isAdministrator = currentUser?.role === 'Administrator';
  const add = isAdministrator
    ? workingGroups({}).workingGroup({ workingGroupId }).resources({}).add({}).$
    : undefined;

  const edit = isAdministrator
    ? workingGroups({}).workingGroup({ workingGroupId }).resources({}).edit({})
        .$
    : undefined;
  const editRoute = workingGroups({})
    .workingGroup({ workingGroupId })
    .resources({})
    .edit({});
  const overview = workingGroups({})
    .workingGroup({ workingGroupId })
    .overview({}).$;
  const resources = workingGroups({})
    .workingGroup({ workingGroupId })
    .resources({}).$;
  const updateWorkingGroupResources =
    usePutWorkingGroupResources(workingGroupId);

  if (workingGroup) {
    return (
      <WorkingGroupDetailPage
        backHref={backHref}
        {...workingGroup}
        isWorkingGroupMember={isWorkingGroupMember}
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
                        modalTitle={modalInfo.title}
                        modalDescription={modalInfo.description}
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
                      <EditResource
                        workingGroupId={workingGroupId}
                        workingGroup={workingGroup}
                        backHref={resources}
                        updateWorkingGroupResources={
                          updateWorkingGroupResources
                        }
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
    );
  }
  return <NotFoundPage />;
};

export default WorkingGroupDetail;
