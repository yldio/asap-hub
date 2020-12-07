import React from 'react';
import { useRouteMatch, Route } from 'react-router-dom';
import { join } from 'path';
import { TeamProfileWorkspace, ToolModal } from '@asap-hub/react-components';
import { TeamTool, TeamResponse } from '@asap-hub/model';
import { usePatchTeamById } from './state';
import { usePushFromHere } from '../../history';

interface WorkspaceProps {
  readonly team: TeamResponse & Required<Pick<TeamResponse, 'tools'>>;
}
const Workspace: React.FC<WorkspaceProps> = ({ team }) => {
  const { path, url } = useRouteMatch();
  const historyPush = usePushFromHere();

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
          onSave={async (data: TeamTool) => {
            await patchTeam({
              tools: [...(team.tools ?? []), data],
            });
            historyPush(url);
          }}
        />
      </Route>
      {team.tools.map((tool, i) => (
        <Route key={`tool-${i}`} exact path={`${path}/tools/${i}`}>
          <ToolModal
            {...tool}
            title="Edit Link"
            backHref={url}
            onSave={async (data: TeamTool) => {
              await patchTeam({
                tools: Object.assign([], team.tools, { [i]: data }),
              });
              historyPush(url);
            }}
          />
        </Route>
      ))}
    </>
  );
};

export default Workspace;
