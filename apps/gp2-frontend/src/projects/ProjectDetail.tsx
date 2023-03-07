import { Frame } from '@asap-hub/frontend-utils';
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
import { Redirect, Route, Switch } from 'react-router-dom';
import { gp2 as gp2Model } from '@asap-hub/model';
import { FC, lazy, useEffect } from 'react';
import { usePutProjectResources, useProjectById } from './state';

const { projects } = gp2Routing;

const loadCreateProjectOutput = () =>
  import(
    /* webpackChunkName: "project-create-output-" */ './CreateProjectOutput'
  );

const CreateProjectOutput = lazy(loadCreateProjectOutput);

const ProjectDetail: FC<Record<string, never>> = () => {
  const { projectId } = useRouteParams(projects({}).project);
  const project = useProjectById(projectId);

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
  const resources = resourcesRoute.$;

  const updateProjectResources = usePutProjectResources(projectId);

  useEffect(() => {
    loadCreateProjectOutput();
  }, [project]);

  if (project) {
    return (
      <Switch>
        <Route exact path={projectRoute.$ + createOutputRoute.template}>
          <Frame title="Create Output">
            <CreateProjectOutput />
          </Frame>
        </Route>
        <ProjectDetailPage
          isProjectMember={isProjectMember}
          isAdministrator={isAdministrator}
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
            <Redirect to={overview} />
          </Switch>
        </ProjectDetailPage>
      </Switch>
    );
  }
  return <NotFoundPage />;
};

export default ProjectDetail;
