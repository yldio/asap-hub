import {
  EditResourceModal,
  OutputFormPage,
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
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import EventsList from '../events/EventsList';
import { useUpcomingAndPastEvents } from '../events/state';
import Frame from '../Frame';
import { usePaginationParams } from '../hooks';
import { useOutputById, useOutputs } from '../outputs/state';
import { usePutWorkingGroupResources, useWorkingGroupById } from './state';

const { workingGroups } = gp2Routing;

type WorkingGroupDetailProps = {
  currentTime: Date;
};
const loadCreateWorkingGroupOutput = () =>
  import(
    /* webpackChunkName: "working-group-create-output-" */ './CreateWorkingGroupOutput'
  );
const CreateWorkingGroupOutput = lazy(loadCreateWorkingGroupOutput);
const loadOutputDirectory = () =>
  import(
    /* webpackChunkName: "working-group-output-directory" */ '../outputs/OutputDirectory'
  );
const OutputDirectory = lazy(loadOutputDirectory);

const DuplicateOutput: FC = () => {
  const { outputId } = useParams<{ outputId: string }>();
  const output = useOutputById(outputId ?? '');
  if (output && output.workingGroups?.[0]?.id) {
    return (
      <OutputFormPage>
        <CreateWorkingGroupOutput
          outputData={{
            ...output,
            id: '',
            link: undefined,
            title: `Copy of ${output.title}`,
          }}
        />
      </OutputFormPage>
    );
  }
  return <NotFoundPage />;
};

// Separate component for the main working group page that needs outputs and events data
// This prevents fetching outputs/events data when navigating to create-output routes
const WorkingGroupMainPage: FC<{
  workingGroup: gp2Model.WorkingGroupResponse;
  currentTime: Date;
  workingGroupId: string;
}> = ({ workingGroup, currentTime, workingGroupId }) => {
  const { pageSize } = usePaginationParams();
  const { total: outputsTotal } = useOutputs({
    currentPage: 0,
    filters: new Set(),
    pageSize,
    searchQuery: '',
    workingGroupId,
  });

  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(currentTime, {
    workingGroupId,
  });

  const currentUser = useCurrentUserGP2();
  const isWorkingGroupMember =
    workingGroup?.members.some(({ userId }) => userId === currentUser?.id) ||
    false;
  const isAdministrator = currentUser?.role === 'Administrator';
  const workingGroupRoute = workingGroups({}).workingGroup({ workingGroupId });
  const resourcesRoute = workingGroupRoute.workspace({});
  const editRoute = resourcesRoute.edit({});
  const add = isAdministrator ? resourcesRoute.add({}).$ : undefined;
  const edit = isAdministrator ? editRoute.$ : undefined;
  const resources = resourcesRoute.$;

  const updateWorkingGroupResources =
    usePutWorkingGroupResources(workingGroupId);

  return (
    <WorkingGroupDetailPage
      {...workingGroup}
      isWorkingGroupMember={isWorkingGroupMember}
      isAdministrator={isAdministrator}
      outputsTotal={outputsTotal}
      upcomingTotal={upcomingEvents?.total || 0}
      pastTotal={pastEvents?.total || 0}
    >
      <Routes>
        <Route
          path="overview"
          element={
            <Frame title="Overview">
              <WorkingGroupOverview {...workingGroup} />
            </Frame>
          }
        />
        {isWorkingGroupMember && (
          <Route
            path="workspace/*"
            element={
              <Frame title="Resources">
                <WorkingGroupResources
                  {...workingGroup}
                  add={add}
                  edit={edit}
                />
                {isAdministrator && (
                  <Routes>
                    <Route
                      path="add"
                      element={
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
                      }
                    />
                    <Route
                      path="edit/:resourceIndex"
                      element={
                        <EditResourceModal
                          route={editRoute.resource}
                          resources={workingGroup.resources || []}
                          backHref={resources}
                          updateResources={updateWorkingGroupResources}
                        />
                      }
                    />
                  </Routes>
                )}
              </Frame>
            }
          />
        )}
        <Route
          path="outputs"
          element={
            <Frame title="Shared Outputs">
              <OutputDirectory workingGroupId={workingGroupId} />
            </Frame>
          }
        />
        <Route
          path="upcoming"
          element={
            <Frame title="Upcoming Events">
              <EventsList
                constraint={{ workingGroupId }}
                currentTime={currentTime}
                past={false}
              />
            </Frame>
          }
        />
        <Route
          path="past"
          element={
            <Frame title="Past Events">
              <EventsList
                currentTime={currentTime}
                past={true}
                constraint={{ workingGroupId }}
              />
            </Frame>
          }
        />
        <Route index element={<Navigate to="overview" replace />} />
      </Routes>
    </WorkingGroupDetailPage>
  );
};

const WorkingGroupDetail: FC<WorkingGroupDetailProps> = ({ currentTime }) => {
  const { workingGroupId } = useRouteParams(workingGroups({}).workingGroup);
  const workingGroup = useWorkingGroupById(workingGroupId);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadOutputDirectory().then(loadCreateWorkingGroupOutput);
  }, [workingGroup]);

  const currentUser = useCurrentUserGP2();
  const isAdministrator = currentUser?.role === 'Administrator';

  if (workingGroup) {
    return (
      <Routes>
        <Route
          path="create-output/:outputDocumentType"
          element={
            <Frame title="Create Output">
              <OutputFormPage>
                <CreateWorkingGroupOutput />
              </OutputFormPage>
            </Frame>
          }
        />
        {isAdministrator && (
          <Route path="duplicate/:outputId" element={<DuplicateOutput />} />
        )}
        <Route
          path="*"
          element={
            <WorkingGroupMainPage
              workingGroup={workingGroup}
              currentTime={currentTime}
              workingGroupId={workingGroupId}
            />
          }
        />
      </Routes>
    );
  }
  return <NotFoundPage />;
};

export default WorkingGroupDetail;
