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
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
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

  //fix
  const output = useOutputById(outputId!);
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

const WorkingGroupDetail: FC<WorkingGroupDetailProps> = ({ currentTime }) => {
  // const { path } = useMatch();

  const { workingGroupId } = useTypedParams(workingGroups.DEFAULT.DETAILS);
  const workingGroup = useWorkingGroupById(workingGroupId);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadOutputDirectory().then(loadCreateWorkingGroupOutput);
  }, [workingGroup]);

  const { pageSize } = usePaginationParams();
  const { total: outputsTotal } = useOutputs({
    currentPage: 0,
    filters: new Set(),
    pageSize,
    searchQuery: '',
    workingGroupId,
  });

  const currentUser = useCurrentUserGP2();
  const isWorkingGroupMember =
    workingGroup?.members.some(({ userId }) => userId === currentUser?.id) ||
    false;
  const isAdministrator = currentUser?.role === 'Administrator';
  const workingGroupRoute = workingGroups.DEFAULT.$.DETAILS;
  const resourcesRoute = workingGroupRoute.$.WORKSPACE;
  const createOutputRoute = workingGroupRoute.$.CREATE_OUTPUT.relativePath;
  const duplicateOutputRoute =
    workingGroupRoute.$.DUPLICATE_OUTPUT.relativePath;
  const editRoute = resourcesRoute.$.EDIT;
  const add = isAdministrator ? resourcesRoute.$.ADD.relativePath : undefined;
  const edit = isAdministrator ? editRoute.relativePath : undefined;
  const overview = workingGroupRoute.$.OVERVIEW.relativePath;
  const outputs = workingGroupRoute.$.OUTPUTS.relativePath;
  const resources = resourcesRoute.relativePath;
  const upcoming = workingGroupRoute.$.UPCOMING.relativePath;
  const past = workingGroupRoute.$.PAST.relativePath;

  const updateWorkingGroupResources =
    usePutWorkingGroupResources(workingGroupId);

  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(currentTime, {
    workingGroupId,
  });

  if (workingGroup) {
    return (
      <Routes>
        <Route
          path={createOutputRoute}
          element={
            <Frame title="Create Output">
              <OutputFormPage>
                <CreateWorkingGroupOutput />
              </OutputFormPage>
            </Frame>
          }
        />
        {isAdministrator && (
          <Route
            path={duplicateOutputRoute}
            element={
              <Frame title="Duplicate Output">
                <DuplicateOutput />
              </Frame>
            }
          />
        )}
        <Route
          path="*"
          element={
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
                  path={overview}
                  element={
                    <Frame title="Overview">
                      <WorkingGroupOverview {...workingGroup} />
                    </Frame>
                  }
                />

                {isWorkingGroupMember && (
                  <Route
                    path={resources}
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
                              path={add}
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
                              path={editRoute.$.RESOURCE.relativePath}
                              element={
                                <EditResourceModal
                                  route={editRoute.$.RESOURCE}
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
                  path={outputs}
                  element={
                    <Frame title="Shared Outputs">
                      <OutputDirectory workingGroupId={workingGroupId} />
                    </Frame>
                  }
                />
                <Route
                  path={upcoming}
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
                  path={past}
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
                <Route path="*" element={<Navigate to={overview} />} />
              </Routes>
            </WorkingGroupDetailPage>
          }
        />
      </Routes>
    );
  }
  return <NotFoundPage />;
};

export default WorkingGroupDetail;
