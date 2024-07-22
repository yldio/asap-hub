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
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { gp2 as gp2Validation } from '@asap-hub/validation';
import { FC, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
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
  const output = useOutputById(outputId!);
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

const ProjectDetail: FC<ProjectDetailProps> = ({ currentTime }) => {
  // const { path } = useMatch();
  // const { projectId } = useRouteParams(projects({}).project);
  const { projectId } = useTypedParams(projects.DEFAULT.DETAILS);
  const project = useProjectById(projectId);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadOutputDirectory().then(loadCreateProjectOutput);
  }, [project]);

  const { pageSize } = usePaginationParams();
  const { total } = useOutputs({
    currentPage: 0,
    filters: new Set(),
    pageSize,
    searchQuery: '',
    projectId,
  });

  const currentUser = useCurrentUserGP2();
  const isProjectMember =
    project?.members.some(({ userId }) => userId === currentUser?.id) || false;
  const userRole = getUserRole(currentUser, 'Projects', projectId);
  const isAdministrator =
    currentUser?.role === 'Administrator' || userRole === 'Project manager';
  const projectRoute = projects.DEFAULT.DETAILS;
  const createOutputRoute = projectRoute.CREATE_OUTPUT.relativePath;
  const duplicateOutputRoute = projectRoute.DUPLICATE_OUTPUT.relativePath;
  const workspaceRoute = projectRoute.WORKSPACE;
  const editRoute = workspaceRoute.EDIT;
  const add = isAdministrator ? workspaceRoute.ADD.relativePath : undefined;
  const edit = isAdministrator ? editRoute.relativePath : undefined;
  const overview = projectRoute.OVERVIEW.relativePath;
  const outputs = projectRoute.OUTPUTS.relativePath;
  const workspace = workspaceRoute.relativePath;
  const upcoming = projectRoute.UPCOMING.relativePath;
  const past = projectRoute.PAST.relativePath;

  const updateProjectResources = usePutProjectResources(projectId);

  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(currentTime, {
    projectId,
  });

  if (project) {
    return (
      <Routes>
        <Route
          path={createOutputRoute}
          element={
            <Frame title="Create Output">
              <OutputFormPage>
                <CreateProjectOutput />
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
                  path={overview}
                  element={
                    <Frame title="Overview">
                      <ProjectOverview {...project} />
                    </Frame>
                  }
                />
                {isProjectMember && (
                  <Route
                    path={workspace}
                    element={
                      <Frame title="Workspace">
                        <ProjectResources {...project} add={add} edit={edit} />
                        {isAdministrator && (
                          <Routes>
                            <Route
                              path={add}
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
                              path={editRoute.$.RESOURCE.relativePath}
                              element={
                                <EditResourceModal
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
                  path={outputs}
                  element={
                    <Frame title="Shared Outputs">
                      <OutputDirectory projectId={projectId} />
                    </Frame>
                  }
                />
                <Route
                  path={upcoming}
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
                  path={past}
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
                <Route path="*" element={<Navigate to={overview} />} />
              </Routes>
            </ProjectDetailPage>
          }
        />
      </Routes>
    );
  }
  return <NotFoundPage />;
};

export default ProjectDetail;
