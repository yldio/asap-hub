import {
  EditResourceModal,
  OutputFormPage,
  ProjectDetailPage,
  ProjectOverview,
  ProjectResources,
  ResourceModal,
} from '@asap-hub/gp2-components';
import { gp2 as gp2Model } from '@asap-hub/model';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { gp2 as gp2Validation } from '@asap-hub/validation';
import { FC, lazy, useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import EventsList from '../events/EventsList';
import { useUpcomingAndPastEvents } from '../events/state';
import Frame from '../Frame';
import { usePaginationParams } from '../hooks';
import { useOutputById, useOutputs } from '../outputs/state';
import { useProjectById, usePutProjectResources } from './state';

const { projects } = gp2Routing;
const { getUserRole } = gp2Validation;

type ProjectDetailProps = {
  currentTime: Date;
};

const loadCreateProjectOutput = () =>
  import(
    /* webpackChunkName: "project-create-output-" */ './CreateProjectOutput'
  );
const CreateProjectOutput = lazy(loadCreateProjectOutput);
const loadOutputDirectory = () =>
  import(
    /* webpackChunkName: "project-output-directory" */ '../outputs/OutputDirectory'
  );
const OutputDirectory = lazy(loadOutputDirectory);

const DuplicateOutput: FC = () => {
  const { outputId } = useParams<{ outputId: string }>();
  const output = useOutputById(outputId ?? '');
  if (output && output.projects?.[0]?.id) {
    return (
      <OutputFormPage>
        <CreateProjectOutput
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

// Separate component for the main project page that needs outputs and events data
// This prevents fetching outputs/events data when navigating to create-output routes
const ProjectMainPage: FC<{
  project: gp2Model.ProjectResponse;
  currentTime: Date;
  projectId: string;
}> = ({ project, currentTime, projectId }) => {
  const { pageSize } = usePaginationParams();
  const { total } = useOutputs({
    currentPage: 0,
    filters: new Set(),
    pageSize,
    searchQuery: '',
    projectId,
  });

  // Memoize constraint to prevent new object reference on every render
  const constraint = useMemo(() => ({ projectId }), [projectId]);

  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(
    currentTime,
    constraint,
  );

  const currentUser = useCurrentUserGP2();
  const isProjectMember =
    project?.members.some(({ userId }) => userId === currentUser?.id) || false;
  const userRole = getUserRole(currentUser, 'Projects', projectId);
  const isAdministrator =
    currentUser?.role === 'Administrator' || userRole === 'Project manager';
  const projectRoute = projects({}).project({ projectId });
  const workspaceRoute = projectRoute.workspace({});
  const editRoute = workspaceRoute.edit({});
  const add = isAdministrator ? workspaceRoute.add({}).$ : undefined;
  const edit = isAdministrator ? editRoute.$ : undefined;
  const workspace = workspaceRoute.$;

  const updateProjectResources = usePutProjectResources(projectId);

  return (
    <ProjectDetailPage
      isProjectMember={isProjectMember}
      isAdministrator={isAdministrator}
      outputsTotal={total}
      upcomingTotal={upcomingEvents?.total || 0}
      pastTotal={pastEvents?.total || 0}
      {...project}
    >
      <Routes>
        <Route
          path="overview"
          element={
            <Frame title="Overview">
              <ProjectOverview {...project} />
            </Frame>
          }
        />
        {isProjectMember && (
          <Route
            path="workspace/*"
            element={
              <Frame title="Workspace">
                <ProjectResources {...project} add={add} edit={edit} />
                {isAdministrator && (
                  <Routes>
                    <Route
                      path="add"
                      element={
                        <ResourceModal
                          modalTitle={'Add Resource'}
                          modalDescription={
                            'Select a resource type and provide the neccessary information required to share a resource privately with your group.'
                          }
                          backHref={workspace}
                          onSave={(resource: gp2Model.Resource) =>
                            updateProjectResources([
                              ...(project.resources || []),
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
                          resources={project.resources || []}
                          backHref={workspace}
                          updateResources={updateProjectResources}
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
              <OutputDirectory projectId={projectId} />
            </Frame>
          }
        />
        <Route
          path="upcoming"
          element={
            <Frame title="Upcoming Events">
              <EventsList
                constraint={{ projectId }}
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
                constraint={{ projectId }}
              />
            </Frame>
          }
        />
        <Route index element={<Navigate to="overview" replace />} />
      </Routes>
    </ProjectDetailPage>
  );
};

const ProjectDetail: FC<ProjectDetailProps> = ({ currentTime }) => {
  const { projectId } = useRouteParams(projects({}).project);
  const project = useProjectById(projectId);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadOutputDirectory().then(loadCreateProjectOutput);
  }, [project]);

  const currentUser = useCurrentUserGP2();
  const userRole = getUserRole(currentUser, 'Projects', projectId);
  const isAdministrator =
    currentUser?.role === 'Administrator' || userRole === 'Project manager';

  if (project) {
    return (
      <Routes>
        <Route
          path="create-output/:outputDocumentType"
          element={
            <Frame title="Create Output">
              <OutputFormPage>
                <CreateProjectOutput />
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
            <ProjectMainPage
              project={project}
              currentTime={currentTime}
              projectId={projectId}
            />
          }
        />
      </Routes>
    );
  }
  return <NotFoundPage />;
};

export default ProjectDetail;
