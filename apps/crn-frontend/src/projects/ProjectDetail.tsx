import { FC, lazy } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router';
import { Frame } from '@asap-hub/frontend-utils';
import { isProjectLead } from '@asap-hub/model';
import {
  ProjectDetailPage,
  ProjectDetailAbout,
  NotFoundPage,
} from '@asap-hub/react-components';
import { useCurrentUserCRN, useFlags } from '@asap-hub/react-context';
import { useProjectById } from './state';
import { useFetchAimArticles } from './articles-state';
import { ManuscriptToastProvider } from '../network/teams/ManuscriptToastProvider';
import { EligibilityReasonProvider } from '../network/teams/EligibilityReasonProvider';
import ProjectWorkspace from './ProjectWorkspace';
import type { ProjectDetailConfig } from './projectDetailConfig';
import { mockLoadArticleOptions } from './mock-milestones';

const loadProjectManuscript = () =>
  import(/* webpackChunkName: "project-manuscript" */ './ProjectManuscript');
const loadProjectMilestones = () =>
  import(/* webpackChunkName: "project-manuscript" */ './ProjectMilestones');
const loadProjectComplianceReport = () =>
  import(
    /* webpackChunkName: "project-compliance-report" */ './ProjectComplianceReport'
  );

const ProjectManuscript = lazy(loadProjectManuscript);
const ProjectMilestones = lazy(loadProjectMilestones);
const ProjectComplianceReport = lazy(loadProjectComplianceReport);

type Props = {
  config: ProjectDetailConfig;
};

const ProjectDetail: FC<Props> = ({ config }) => {
  const { projectId: rawProjectId } = useParams<{ projectId: string }>();
  const projectId = rawProjectId ?? '';
  const projectDetail = useProjectById(projectId);
  const fetchArticles = useFetchAimArticles();
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
  const isLead =
    !!user && isProjectLead(user.id, user.teams ?? [], projectDetail);
  const showWorkspace =
    isEnabled('PROJECT_WORKSPACE') && (isProjectMember || isStaff);
  const workspaceHref = showWorkspace ? route.workspace({}).$ : undefined;
  const isProjectMilestonesEnabled = isEnabled('PROJECT_AIMS_AND_MILESTONES');

  return (
    <Frame title={projectDetail.title || ''}>
      <ManuscriptToastProvider>
        <EligibilityReasonProvider>
          <Routes>
            {showWorkspace && (
              <Route
                path={`workspace${
                  route.workspace({}).createManuscript.template
                }`}
                element={
                  <Frame title="Create Manuscript">
                    <ProjectManuscript
                      projectId={projectId}
                      projectType={config.projectTypeKey}
                    />
                  </Frame>
                }
              />
            )}
            {showWorkspace && (
              <Route
                path={`workspace${route.workspace({}).editManuscript.template}`}
                element={
                  <Frame title="Edit Manuscript">
                    <ProjectManuscript
                      projectId={projectId}
                      projectType={config.projectTypeKey}
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
                      projectId={projectId}
                      projectType={config.projectTypeKey}
                      resubmitManuscript
                    />
                  </Frame>
                }
              />
            )}
            {showWorkspace && (
              <Route
                path={`workspace${
                  route.workspace({}).createComplianceReport.template
                }`}
                element={
                  <Frame title="Create Compliance Report">
                    <ProjectComplianceReport
                      projectId={projectId}
                      projectType={config.projectTypeKey}
                    />
                  </Frame>
                }
              />
            )}
            <Route
              path="*"
              element={
                <ProjectDetailPage
                  {...projectDetail}
                  pointOfContactEmail={projectDetail.contactEmail || undefined}
                  aboutHref={route.about({}).$}
                  workspaceHref={workspaceHref}
                  milestonesHref={route.milestones({}).$}
                >
                  <Routes>
                    <Route
                      path="about"
                      element={
                        <ProjectDetailAbout
                          {...projectDetail}
                          pointOfContactEmail={
                            projectDetail.contactEmail || undefined
                          }
                          fetchArticles={fetchArticles}
                          seeMilestonesHref={route.milestones({}).$}
                        />
                      }
                    />
                    <Route
                      path="milestones"
                      element={
                        isProjectMilestonesEnabled ? (
                          <Frame title="Project Milestones">
                            <ProjectMilestones
                              projectId={projectId}
                              seeAimsHref={route.about({}).$}
                              hasSupplementGrant={
                                'supplementGrant' in projectDetail &&
                                !!projectDetail.supplementGrant
                              }
                              isLead={isLead}
                              loadArticleOptions={mockLoadArticleOptions}
                              milestonesLastUpdated={
                                projectDetail.milestonesLastUpdated
                              }
                            />
                          </Frame>
                        ) : (
                          <NotFoundPage />
                        )
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
                            manuscripts={projectDetail.manuscripts ?? []}
                            collaborationManuscripts={
                              projectDetail.collaborationManuscripts ?? []
                            }
                            tools={projectDetail.tools ?? []}
                            lastModifiedDate={new Date().toISOString()}
                            contactEmail={
                              projectDetail.contactEmail || undefined
                            }
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
                            getEditManuscriptHref={(manuscriptId) =>
                              route
                                .workspace({})
                                .editManuscript({ manuscriptId }).$
                            }
                            getResubmitManuscriptHref={(manuscriptId) =>
                              route
                                .workspace({})
                                .resubmitManuscript({ manuscriptId }).$
                            }
                            getCreateComplianceReportHref={(manuscriptId) =>
                              route
                                .workspace({})
                                .createComplianceReport({ manuscriptId }).$
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
              }
            />
          </Routes>
        </EligibilityReasonProvider>
      </ManuscriptToastProvider>
    </Frame>
  );
};

export default ProjectDetail;
