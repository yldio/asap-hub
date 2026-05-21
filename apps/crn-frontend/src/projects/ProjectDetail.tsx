import { FC, lazy } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router';
import { Frame } from '@asap-hub/frontend-utils';
import { isProjectLead, isProjectMember } from '@asap-hub/model';
import {
  ProjectDetailPage,
  ProjectDetailAbout,
  NotFoundPage,
} from '@asap-hub/react-components';
import { useCurrentUserCRN, useFlags } from '@asap-hub/react-context';
import { useProjectArticlesSuggestions, useProjectById } from './state';
import { useFetchAimArticles } from './articles-state';
import { ManuscriptToastProvider } from '../network/teams/ManuscriptToastProvider';
import { EligibilityReasonProvider } from '../network/teams/EligibilityReasonProvider';
import ProjectWorkspace from './ProjectWorkspace';
import ProjectOutputs from './ProjectOutputs';
import {
  createProjectDraftOutputsMock,
  createProjectOutputsMock,
} from './projectOutputs.mock';
import type { ProjectDetailConfig } from './projectDetailConfig';

const loadProjectManuscript = () =>
  import(/* webpackChunkName: "project-manuscript" */ './ProjectManuscript');
const loadProjectMilestones = () =>
  import(/* webpackChunkName: "project-milestones" */ './ProjectMilestones');
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
  const isOpenScienceMember =
    user?.role === 'Staff' && !!user?.openScienceTeamMember;
  const { hash: targetManuscript } = useLocation();

  const teamId =
    projectDetail && 'teamId' in projectDetail
      ? projectDetail.teamId
      : undefined;

  // TODO: should be expanded to handle searching by project id as this will fail for user-based projects.
  const loadArticleOptions = useProjectArticlesSuggestions(teamId ?? projectId);

  if (!projectDetail) {
    return <NotFoundPage />;
  }

  if (projectDetail.projectType !== config.projectType) {
    return <NotFoundPage />;
  }

  const route = config.getRoute(projectId);

  const isMember =
    !!user && isProjectMember(user.id, user.teams ?? [], projectDetail);
  const isLead =
    !!user && isProjectLead(user.id, user.teams ?? [], projectDetail);
  const showWorkspace =
    isEnabled('PROJECT_WORKSPACE') && (isMember || isOpenScienceMember);
  const canSubmitManuscript = showWorkspace && isMember;
  const canEditOrResubmitManuscript =
    showWorkspace && (isMember || isOpenScienceMember);
  const canCreateComplianceReport = showWorkspace && isOpenScienceMember;

  const workspaceHref = showWorkspace ? route.workspace({}).$ : undefined;
  const isProjectMilestonesEnabled = isEnabled('PROJECT_AIMS_AND_MILESTONES');
  const isProjectOutputsEnabled = isEnabled('PROJECT_OUTPUTS');

  const hasSupplementGrant =
    'supplementGrant' in projectDetail && !!projectDetail.supplementGrant;
  const activeProjectAims =
    (hasSupplementGrant
      ? projectDetail.supplementGrant?.aims
      : projectDetail.originalGrantAims) || [];

  return (
    <Frame title={projectDetail.title || ''}>
      <ManuscriptToastProvider>
        <EligibilityReasonProvider>
          <Routes>
            {canSubmitManuscript && (
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
            {canEditOrResubmitManuscript && (
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
            {canEditOrResubmitManuscript && (
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
            {canCreateComplianceReport && (
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
                  outputsHref={
                    isProjectOutputsEnabled ? route.outputs({}).$ : undefined
                  }
                  draftOutputsHref={
                    isProjectOutputsEnabled
                      ? route.draftOutputs({}).$
                      : undefined
                  }
                  outputsCount={
                    isProjectOutputsEnabled
                      ? createProjectOutputsMock(
                          projectId,
                          projectDetail.title || '',
                        ).length
                      : undefined
                  }
                  draftOutputsCount={
                    isProjectOutputsEnabled
                      ? createProjectDraftOutputsMock(
                          projectId,
                          projectDetail.title || '',
                        ).length
                      : undefined
                  }
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
                              hasSupplementGrant={hasSupplementGrant}
                              aims={activeProjectAims}
                              isLead={isLead}
                              loadArticleOptions={loadArticleOptions}
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
                            isProjectMember={isMember}
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
                      path="outputs"
                      element={
                        isProjectOutputsEnabled ? (
                          <Frame title="Project Outputs">
                            <ProjectOutputs
                              projectId={projectId}
                              projectTitle={projectDetail.title || ''}
                            />
                          </Frame>
                        ) : (
                          <NotFoundPage />
                        )
                      }
                    />
                    <Route
                      path="draft-outputs"
                      element={
                        isProjectOutputsEnabled ? (
                          <Frame title="Project Draft Outputs">
                            <ProjectOutputs
                              projectId={projectId}
                              projectTitle={projectDetail.title || ''}
                              draftOutputs
                            />
                          </Frame>
                        ) : (
                          <NotFoundPage />
                        )
                      }
                    />
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
