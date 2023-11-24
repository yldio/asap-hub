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
import {
  useCurrentUserGP2,
  useCurrentUserRoleGP2,
} from '@asap-hub/react-context';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { FC, lazy, useEffect } from 'react';
import {
  Redirect,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import EventsList from '../events/EventsList';
import { useUpcomingAndPastEvents } from '../events/state';
import Frame from '../Frame';
import { usePaginationParams } from '../hooks';
import { useOutputById, useOutputs } from '../outputs/state';
import { useProjectById, usePutProjectResources } from './state';

const { projects } = gp2Routing;

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
  const output = useOutputById(outputId);
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
  const { path } = useRouteMatch();
  const { projectId } = useRouteParams(projects({}).project);
  const project = useProjectById(projectId);
  useEffect(() => {
    // eslint-disable-next-line @typescripyyt-eslint/no-floating-promises
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
  const isAdministrator = currentUser?.role === 'Administrator';
  const userRole = useCurrentUserRoleGP2(projectId, 'Projects');
  const projectRoute = projects({}).project({ projectId });
  const createOutputRoute = projectRoute.createOutput;
  const duplicateOutputRoute = projectRoute.duplicateOutput;
  const workspaceRoute = projectRoute.workspace({});
  const editRoute = workspaceRoute.edit({});
  const add = isAdministrator ? workspaceRoute.add({}).$ : undefined;
  const edit = isAdministrator ? editRoute.$ : undefined;
  const overview = projectRoute.overview({}).$;
  const outputs = projectRoute.outputs({}).$;
  const workspace = workspaceRoute.$;
  const upcoming = projectRoute.upcoming({}).$;
  const past = projectRoute.past({}).$;

  const updateProjectResources = usePutProjectResources(projectId);

  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(currentTime, {
    projectId,
  });
  const canDuplicateOutput = isAdministrator || userRole === 'Project manager';

  if (project) {
    return (
      <Switch>
        <Route exact path={path + createOutputRoute.template}>
          <Frame title="Create Output">
            <OutputFormPage>
              <CreateProjectOutput />
            </OutputFormPage>
          </Frame>
        </Route>
        {canDuplicateOutput && (
          <Route exact path={path + duplicateOutputRoute.template}>
            <Frame title="Duplicate Output">
              <DuplicateOutput />
            </Frame>
          </Route>
        )}
        <ProjectDetailPage
          isProjectMember={isProjectMember}
          isAdministrator={isAdministrator}
          outputsTotal={total}
          upcomingTotal={upcomingEvents?.total || 0}
          pastTotal={pastEvents?.total || 0}
          {...project}
        >
          <Switch>
            <Route path={overview}>
              <Frame title="Overview">
                <ProjectOverview {...project} />
              </Frame>
            </Route>
            {isProjectMember && (
              <Route path={workspace}>
                <Frame title="Workspace">
                  <ProjectResources {...project} add={add} edit={edit} />
                  {isAdministrator && (
                    <>
                      <Route path={add}>
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
                      </Route>
                      <Route exact path={edit + editRoute.resource.template}>
                        <EditResourceModal
                          route={editRoute.resource}
                          resources={project.resources || []}
                          backHref={workspace}
                          updateResources={updateProjectResources}
                        />
                      </Route>
                    </>
                  )}
                </Frame>
              </Route>
            )}
            <Route path={outputs}>
              <Frame title="Shared Outputs">
                <OutputDirectory projectId={projectId} />
              </Frame>
            </Route>
            <Route path={upcoming}>
              <Frame title="Upcoming Events">
                <EventsList
                  constraint={{ projectId }}
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
                  constraint={{ projectId }}
                />
              </Frame>
            </Route>
            <Redirect to={overview} />
          </Switch>
        </ProjectDetailPage>
      </Switch>
    );
  }
  return <NotFoundPage />;
};

export default ProjectDetail;
