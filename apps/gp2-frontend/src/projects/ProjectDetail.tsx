import {
  EditResourceModal,
  ProjectDetailPage,
  ProjectOverview,
  ProjectResources,
  ResourceModal,
} from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { gp2 as gp2Model } from '@asap-hub/model';
import { ComponentProps, FC, lazy, useEffect } from 'react';
import EventsList from '../events/EventsList';
import { useUpcomingAndPastEvents } from '../events/state';
import { usePutProjectResources, useProjectById } from './state';
import { useOutputs } from '../outputs/state';
import OutputList from '../outputs/OutputList';
import Frame from '../Frame';

const { projects } = gp2Routing;

const loadCreateProjectOutput = () =>
  import(
    /* webpackChunkName: "project-create-output-" */ './CreateProjectOutput'
  );

const CreateProjectOutput = lazy(loadCreateProjectOutput);

type ProjectDetailProps = {
  currentTime: Date;
} & Pick<ComponentProps<typeof CreateProjectOutput>, 'setBannerMessage'>;
const ProjectDetail: FC<ProjectDetailProps> = ({
  currentTime,
  setBannerMessage,
}) => {
  const { path } = useRouteMatch();
  const { projectId } = useRouteParams(projects({}).project);
  const project = useProjectById(projectId);
  const { total } = useOutputs({
    filter: { projects: projectId },
  });

  const currentUser = useCurrentUserGP2();
  const isProjectMember =
    project?.members.some(({ userId }) => userId === currentUser?.id) || false;
  const isAdministrator = currentUser?.role === 'Administrator';
  const projectRoute = projects({}).project({ projectId });
  const createOutputRoute = projectRoute.createOutput;
  const resourcesRoute = projectRoute.resources({});
  const editRoute = resourcesRoute.edit({});
  const add = isAdministrator ? resourcesRoute.add({}).$ : undefined;
  const edit = isAdministrator ? editRoute.$ : undefined;
  const overview = projectRoute.overview({}).$;
  const outputs = projectRoute.outputs({}).$;
  const resources = resourcesRoute.$;
  const upcoming = projectRoute.upcoming({}).$;
  const past = projectRoute.past({}).$;

  const updateProjectResources = usePutProjectResources(projectId);

  useEffect(() => {
    loadCreateProjectOutput();
  }, [project]);

  const [upcomingEvents, pastEvents] = useUpcomingAndPastEvents(currentTime, {
    projectId,
  });
  if (project) {
    return (
      <Switch>
        <Route exact path={path + createOutputRoute.template}>
          <Frame title="Create Output">
            <CreateProjectOutput setBannerMessage={setBannerMessage} />
          </Frame>
        </Route>
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
              <Route path={resources}>
                <Frame title="Resources">
                  <ProjectResources {...project} add={add} edit={edit} />
                  {isAdministrator && (
                    <>
                      <Route path={add}>
                        <ResourceModal
                          modalTitle={'Add Resource'}
                          modalDescription={
                            'Select a resource type and provide the neccessary information required to share a resource privately with your group.'
                          }
                          backHref={resources}
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
                          backHref={resources}
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
                <OutputList filters={{ projects: projectId }} />
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
