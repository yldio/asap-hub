import { useContext, useState } from 'react';
import { useRouteMatch, Route } from 'react-router-dom';
import {
  NotFoundPage,
  TeamProfileWorkspace,
  ToolModal,
} from '@asap-hub/react-components';
import { TeamTool, TeamResponse, ManuscriptPutRequest } from '@asap-hub/model';
import { network, useRouteParams } from '@asap-hub/routing';
import { ToastContext, useCurrentUserCRN } from '@asap-hub/react-context';

import {
  useCreateDiscussion,
  useIsComplianceReviewer,
  useManuscriptById,
  usePatchTeamById,
  usePutManuscript,
} from './state';
import { useEligibilityReason } from './useEligibilityReason';

interface WorkspaceProps {
  readonly team: TeamResponse & Required<Pick<TeamResponse, 'tools'>>;
}
const Workspace: React.FC<WorkspaceProps> = ({ team }) => {
  const route = network({}).teams({}).team({ teamId: team.id }).workspace({});
  const { path } = useRouteMatch();
  const { setEligibilityReasons } = useEligibilityReason();
  const isComplianceReviewer = useIsComplianceReviewer();

  const [deleting, setDeleting] = useState(false);
  const patchTeam = usePatchTeamById(team.id);
  const updateManuscript = usePutManuscript();
  const createDiscussion = useCreateDiscussion();

  const toast = useContext(ToastContext);

  const user = useCurrentUserCRN();
  const isTeamMember = !!user?.teams.find(({ id }) => team.id === id);

  return (
    <>
      <Route path={path}>
        <TeamProfileWorkspace
          {...team}
          isTeamMember={isTeamMember}
          setEligibilityReasons={setEligibilityReasons}
          tools={team.tools}
          onUpdateManuscript={(
            manuscriptId: string,
            payload: ManuscriptPutRequest,
          ) => updateManuscript(manuscriptId, payload)}
          onDeleteTool={
            deleting
              ? undefined
              : async (toolIndex) => {
                  setDeleting(true);
                  if (
                    window.confirm(
                      'Are you sure you want to delete this team tool from your team page? This cannot be undone.',
                    )
                  ) {
                    await patchTeam({
                      tools: team.tools.filter((_, i) => toolIndex !== i),
                    }).catch(() => {
                      toast('Something went wrong. Please try again.');
                    });
                  }
                  setDeleting(false);
                }
          }
          isComplianceReviewer={isComplianceReviewer}
          createDiscussion={async (
            manuscriptId: string,
            title: string,
            message: string,
          ) => {
            const discussionId = await createDiscussion(
              manuscriptId,
              title,
              message,
            );
            setFormType({
              type: 'compliance-report-discussion',
              accent: 'successLarge',
            });
            return discussionId;
          }}
          useManuscriptById={useManuscriptById}
        />
      </Route>
      <Route exact path={path + route.tools.template}>
        <ToolModal
          title="Add Link"
          backHref={route.$}
          onSave={(data: TeamTool) =>
            patchTeam({
              tools: [...(team.tools ?? []), data],
            })
          }
        />
      </Route>
      <Route
        exact
        path={path + route.tools.template + route.tools({}).tool.template}
      >
        <EditTool teamId={team.id} tools={team.tools} />
      </Route>
    </>
  );
};

const EditTool: React.FC<{
  readonly teamId: TeamResponse['id'];
  readonly tools: ReadonlyArray<TeamTool>;
}> = ({ teamId, tools }) => {
  const { toolIndex } = useRouteParams(
    network({}).teams({}).team({ teamId }).workspace({}).tools({}).tool,
  );
  const tool = tools[parseInt(toolIndex, 10)];

  const patchTeam = usePatchTeamById(teamId);

  if (!tool) {
    return <NotFoundPage />;
  }

  return (
    <ToolModal
      {...tool}
      title="Edit Link"
      backHref={network({}).teams({}).team({ teamId }).workspace({}).$}
      onSave={(data: TeamTool) =>
        patchTeam({
          tools: Object.assign([], tools, { [toolIndex]: data }),
        })
      }
    />
  );
};

export default Workspace;
