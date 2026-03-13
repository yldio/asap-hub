import { FC, lazy } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router';
import { Frame } from '@asap-hub/frontend-utils';
import {
  ProjectDetailPage,
  ProjectDetailAbout,
  NotFoundPage,
} from '@asap-hub/react-components';
import { useCurrentUserCRN, useFlags } from '@asap-hub/react-context';
import { useProjectById } from './state';
import { ManuscriptToastProvider } from '../network/teams/ManuscriptToastProvider';
import { EligibilityReasonProvider } from '../network/teams/EligibilityReasonProvider';
import ProjectWorkspace from './ProjectWorkspace';
import type { ProjectDetailConfig } from './projectDetailConfig';

const loadProjectManuscript = () =>
  import(/* webpackChunkName: "project-manuscript" */ './ProjectManuscript');
const ProjectManuscript = lazy(loadProjectManuscript);

type Props = {
  config: ProjectDetailConfig;
};

const ProjectDetail: FC<Props> = ({ config }) => {
  const { projectId: rawProjectId } = useParams<{ projectId: string }>();
  const projectId = rawProjectId ?? '';
  const projectDetail = useProjectById(projectId);
  const { isEnabled } = useFlags();
  const user = useCurrentUserCRN();
  const isStaff = user?.role === 'Staff';
  const { hash: targetManuscript } = useLocation();

  if (!projectDetail) {
    return <NotFoundPage />;
  }

  if (projectDetail.projectType !== config.projectType) {
    return <NotFoundPage />;
  }

  const route = config.getRoute(projectId);

  const isProjectMember = !!user?.projects.find(({ id }) => id === projectId);
  const showWorkspace =
    isEnabled('PROJECT_WORKSPACE') && (isProjectMember || isStaff);
  const workspaceHref = showWorkspace ? route.workspace({}).$ : undefined;

  return (
    <Frame title={projectDetail.title || ''}>
      <ManuscriptToastProvider>
        <EligibilityReasonProvider>
          <ProjectDetailPage
            {...projectDetail}
            pointOfContactEmail={projectDetail.contactEmail || undefined}
            aboutHref={route.about({}).$}
            workspaceHref={workspaceHref}
          >
            <Routes>
              {showWorkspace && (
                <Route
                  path={`workspace${
                    route.workspace({}).createManuscript.template
                  }`}
                  element={
                    <ProjectManuscript
                      projectId={projectId}
                      projectType={config.projectTypeKey}
                    />
                  }
                />
              )}
              {showWorkspace && (
                <Route
                  path={`workspace${
                    route.workspace({}).editManuscript.template
                  }`}
                  element={
                    <ProjectManuscript
                      projectId={projectId}
                      projectType={config.projectTypeKey}
                    />
                  }
                />
              )}
              {showWorkspace && (
                <Route
                  path={`workspace${
                    route.workspace({}).resubmitManuscript.template
                  }`}
                  element={
                    <ProjectManuscript
                      projectId={projectId}
                      projectType={config.projectTypeKey}
                      resubmitManuscript
                    />
                  }
                />
              )}
              <Route
                path="about"
                element={
                  <ProjectDetailAbout
                    {...projectDetail}
                    pointOfContactEmail={
                      projectDetail.contactEmail || undefined
                    }
                  />
                }
              />
              {showWorkspace && (
                <Route
                  path="workspace/*"
                  element={
                    <ProjectWorkspace
                      id={projectId}
                      isProjectMember={isProjectMember}
                      isTeamBased={config.getIsTeamBased(projectDetail)}
                      manuscripts={[]}
                      collaborationManuscripts={[]}
                      tools={projectDetail.tools ?? []}
                      lastModifiedDate={new Date().toISOString()}
                      contactEmail={projectDetail.contactEmail || undefined}
                      contactName={config.getContactName(projectDetail)}
                      toolsHref={route.workspace({}).tools({}).$}
                      editToolHref={(index) =>
                        route
                          .workspace({})
                          .tools({})
                          .tool({ toolIndex: `${index}` }).$
                      }
                      isActiveProject={projectDetail.status === 'Active'}
                      createManuscriptHref={
                        route.workspace({}).createManuscript({}).$
                      }
                      targetManuscriptId={targetManuscript.slice(1)}
                      workspaceHref={route.workspace({}).$}
                    />
                  }
                />
              )}
              <Route
                index
                element={<Navigate to={route.about({}).$} replace />}
              />
            </Routes>
          </ProjectDetailPage>
        </EligibilityReasonProvider>
      </ManuscriptToastProvider>
    </Frame>
  );
};

export default ProjectDetail;
