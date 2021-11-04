import { useContext, useState } from 'react';
import { useRouteMatch, Route } from 'react-router-dom';
import {
  NotFoundPage,
  TeamProfileWorkspace,
  ToolModal,
} from '@asap-hub/react-components';
import { TeamTool, TeamResponse } from '@asap-hub/model';
import { network, useRouteParams } from '@asap-hub/routing';
import { ToastContext } from '@asap-hub/react-context';

import { usePatchTeamById } from './state';

interface WorkspaceProps {
  readonly team: TeamResponse & Required<Pick<TeamResponse, 'tools'>>;
}
const Workspace: React.FC<WorkspaceProps> = ({ team }) => {
  const route = network({}).teams({}).team({ teamId: team.id }).workspace({});
  const { path } = useRouteMatch();

  const [deleting, setDeleting] = useState(false);
  const patchTeam = usePatchTeamById(team.id);
  const toast = useContext(ToastContext);

  return (
    <>
      <Route path={path}>
        <TeamProfileWorkspace
          {...team}
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
