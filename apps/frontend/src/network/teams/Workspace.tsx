import React from 'react';
import { useRouteMatch, Route } from 'react-router-dom';
import { join } from 'path';
import { TeamProfileWorkspace, ToolModal } from '@asap-hub/react-components';
import { TeamTool, TeamResponse } from '@asap-hub/model';
import { usePatchTeamById } from './state';

interface WorkspaceProps {
  readonly team: TeamResponse & Required<Pick<TeamResponse, 'tools'>>;
}
const Workspace: React.FC<WorkspaceProps> = ({ team }) => {
  const { path, url } = useRouteMatch();

  const patchTeam = usePatchTeamById(team.id);

  return (
    <>
      <Route path={path}>
        <TeamProfileWorkspace
          {...team}
          newToolHref={join(url, 'tools')}
          tools={team.tools.map((tool, index) => ({
            ...tool,
            editHref: join(url, 'tools', String(index)),
          }))}
        />
      </Route>
      <Route exact path={`${path}/tools`}>
        <ToolModal
          title="Add Link"
          backHref={url}
          onSave={(data: TeamTool) =>
            patchTeam({
              tools: [...(team.tools ?? []), data],
            })
          }
        />
      </Route>
      {team.tools.map((tool, i) => (
        <Route key={`tool-${i}`} exact path={`${path}/tools/${i}`}>
          <ToolModal
            {...tool}
            title="Edit Link"
            backHref={url}
            onSave={(data: TeamTool) =>
              patchTeam({
                tools: Object.assign([], team.tools, { [i]: data }),
              })
            }
          />
        </Route>
      ))}
    </>
  );
};

export default Workspace;
