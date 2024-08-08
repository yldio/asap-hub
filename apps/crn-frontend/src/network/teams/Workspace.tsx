import { useContext, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  NotFoundPage,
  TeamProfileWorkspace,
  ToolModal,
} from '@asap-hub/react-components';
import { TeamTool, TeamResponse } from '@asap-hub/model';
import { networkRoutes } from '@asap-hub/routing';
import { ToastContext } from '@asap-hub/react-context';
import { useTypedParams } from 'react-router-typesafe-routes/dom';

import { usePatchTeamById } from './state';
import { useEligibilityReason } from './useEligibilityReason';

interface WorkspaceProps {
  readonly team: TeamResponse & Required<Pick<TeamResponse, 'tools'>>;
}
const Workspace: React.FC<WorkspaceProps> = ({ team }) => {
  const workspaceRoutes = networkRoutes.DEFAULT.$.TEAMS.$.DETAILS.$.WORKSPACE;
  const { setEligibilityReasons } = useEligibilityReason();

  const [deleting, setDeleting] = useState(false);
  const patchTeam = usePatchTeamById(team.id);
  const toast = useContext(ToastContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <TeamProfileWorkspace
            {...team}
            setEligibilityReasons={setEligibilityReasons}
            tools={team.tools}
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
          />
        }
      />

      <Route
        path={workspaceRoutes.TOOLS.relativePath}
        element={
          <ToolModal
            title="Add Link"
            backHref={workspaceRoutes.buildPath({})}
            onSave={(data: TeamTool) =>
              patchTeam({
                tools: [...(team.tools ?? []), data],
              })
            }
          />
        }
      />
      <Route
        path={workspaceRoutes.$.TOOLS.TOOL.relativePath}
        element={<EditTool teamId={team.id} tools={team.tools} />}
      />
    </Routes>
  );
};

const EditTool: React.FC<{
  readonly teamId: TeamResponse['id'];
  readonly tools: ReadonlyArray<TeamTool>;
}> = ({ teamId, tools }) => {
  const { toolIndex } = useTypedParams(
    networkRoutes.DEFAULT.TEAMS.DETAILS.WORKSPACE.TOOLS.TOOL,
  );

  const tool = tools[toolIndex];

  const patchTeam = usePatchTeamById(teamId);

  if (!tool) {
    return <NotFoundPage />;
  }

  return (
    <ToolModal
      {...tool}
      title="Edit Link"
      // TODO: check if this works
      // network({}).teams({}).team({ teamId }).workspace({}).$
      backHref={
        networkRoutes.DEFAULT.$.TEAMS.$.DETAILS.$.WORKSPACE.relativePath
      }
      onSave={(data: TeamTool) =>
        patchTeam({
          tools: Object.assign([], tools, { [toolIndex]: data }),
        })
      }
    />
  );
};

export default Workspace;
