import { FC, lazy } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router';
import { Frame } from '@asap-hub/frontend-utils';
import {
  ProjectDetailPage,
  ProjectDetailAbout,
  NotFoundPage,
} from '@asap-hub/react-components';
import { useCurrentUserCRN, useFlags } from '@asap-hub/react-context';
import { projects } from '@asap-hub/routing';
import { useProjectById } from './state';
import { ManuscriptToastProvider } from '../network/teams/ManuscriptToastProvider';
import { EligibilityReasonProvider } from '../network/teams/EligibilityReasonProvider';
import ProjectWorkspace from './ProjectWorkspace';

const loadProjectManuscript = () =>
  import(/* webpackChunkName: "project-manuscript" */ './ProjectManuscript');
const ProjectManuscript = lazy(loadProjectManuscript);

type TraineeProjectDetailParams = {
  projectId: string;
};

const TraineeProjectDetail: FC<Record<string, never>> = () => {
  const { projectId } = useParams<TraineeProjectDetailParams>();
  const projectDetail = useProjectById(projectId ?? '');
  const { isEnabled } = useFlags();
  const user = useCurrentUserCRN();
  const isStaff = user?.role === 'Staff';
  const { hash: targetManuscript } = useLocation();

  if (!projectDetail) {
    return <NotFoundPage />;
  }

  // Ensure we're working with a TraineeProjectDetail
  if (projectDetail.projectType !== 'Trainee Project') {
    return <NotFoundPage />;
  }

  const route = projects({})
    .traineeProjects({})
    .traineeProject({ projectId: projectId ?? '' });

  const isProjectMember = !!user?.projects.find(({ id }) => id === projectId);
  const showWorkspace =
    isEnabled('PROJECT_WORKSPACE') && (isProjectMember || isStaff);
  const workspaceHref = showWorkspace ? route.workspace({}).$ : undefined;

  return (
    <Frame title={projectDetail?.title || ''}>
      <ManuscriptToastProvider>
        <EligibilityReasonProvider>
          <ProjectDetailPage
            {...projectDetail}
            pointOfContactEmail={projectDetail.contactEmail}
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
                    <Frame title="Create Manuscript">
                      <ProjectManuscript
                        projectId={projectId ?? ''}
                        projectType="trainee"
                      />
                    </Frame>
                  }
                />
              )}
              {showWorkspace && (
                <Route
                  path={`workspace${
                    route.workspace({}).editManuscript.template
                  }`}
                  element={
                    <Frame title="Edit Manuscript">
                      <ProjectManuscript
                        projectId={projectId ?? ''}
                        projectType="trainee"
                      />
                    </Frame>
                  }
                />
              )}
              {showWorkspace && (
                <Route
                  path={`workspace${
                    route.workspace({}).resubmitManuscript.template
                  }`}
                  element={
                    <Frame title="Resubmit Manuscript">
                      <ProjectManuscript
                        projectId={projectId ?? ''}
                        projectType="trainee"
                        resubmitManuscript
                      />
                    </Frame>
                  }
                />
              )}
              <Route
                path="about"
                element={
                  <ProjectDetailAbout
                    {...projectDetail}
                    pointOfContactEmail={projectDetail.contactEmail}
                  />
                }
              />
              {showWorkspace && (
                <Route
                  path="workspace"
                  element={
                    <ProjectWorkspace
                      id={projectId ?? ''}
                      isProjectMember={isProjectMember}
                      isTeamBased={false}
                      manuscripts={[]}
                      collaborationManuscripts={[]}
                      tools={[]}
                      lastModifiedDate={new Date().toISOString()}
                      contactEmail={projectDetail.contactEmail || undefined}
                      contactName={
                        projectDetail.members?.find(
                          (m) => m.email === projectDetail.contactEmail,
                        )?.displayName
                      }
                      toolsHref={route.workspace({}).$}
                      editToolHref={() => route.workspace({}).$}
                      isActiveProject={projectDetail.status === 'Active'}
                      createManuscriptHref={
                        route.workspace({}).createManuscript({}).$
                      }
                      targetManuscriptId={targetManuscript.slice(1)}
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

export default TraineeProjectDetail;
