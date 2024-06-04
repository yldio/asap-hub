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
import { Redirect, Route, Routes, useParams, useMatch } from 'react-router-dom';
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
  const output = useOutputById(outputId);
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
  const { path } = useMatch();
  const { workingGroupId } = useRouteParams(workingGroups({}).workingGroup);
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
  const workingGroupRoute = workingGroups({}).workingGroup({ workingGroupId });
  const resourcesRoute = workingGroupRoute.workspace({});
  const createOutputRoute = workingGroupRoute.createOutput;
  const duplicateOutputRoute = workingGroupRoute.duplicateOutput;
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

  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(currentTime, {
    workingGroupId,
  });

  if (workingGroup) {
    return (
      <Routes>
        <Route exact path={path + createOutputRoute.template}>
          <Frame title="Create Output">
            <OutputFormPage>
              <CreateWorkingGroupOutput />
            </OutputFormPage>
          </Frame>
        </Route>
        {isAdministrator && (
          <Route exact path={path + duplicateOutputRoute.template}>
            <Frame title="Duplicate Output">
              <DuplicateOutput />
            </Frame>
          </Route>
        )}
        <WorkingGroupDetailPage
          {...workingGroup}
          isWorkingGroupMember={isWorkingGroupMember}
          isAdministrator={isAdministrator}
          outputsTotal={outputsTotal}
          upcomingTotal={upcomingEvents?.total || 0}
          pastTotal={pastEvents?.total || 0}
        >
          <Routes>
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
                <OutputDirectory workingGroupId={workingGroupId} />
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
          </Routes>
        </WorkingGroupDetailPage>
      </Routes>
    );
  }
  return <NotFoundPage />;
};

export default WorkingGroupDetail;
