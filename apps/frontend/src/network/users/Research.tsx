import React, { ComponentProps } from 'react';
import { useRouteMatch, Route, Redirect } from 'react-router-dom';
import { join } from 'path';
import {
  UserProfileResearch,
  TeamMembershipModal,
  OpenQuestionsModal,
} from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';
import { useCurrentUser } from '@asap-hub/react-context';
import { isEnabled } from '@asap-hub/flags';

import { usePatchUserById } from './state';
import Frame from '../../structure/Frame';
import UserGroups from './Groups';

type ResearchProps = {
  user: UserResponse;
  teams: ComponentProps<typeof UserProfileResearch>['teams'];
};
const Research: React.FC<ResearchProps> = ({ user, teams }) => {
  const { id } = useCurrentUser() ?? {};

  const { url, path } = useRouteMatch();

  const patchUser = usePatchUserById(user.id);

  return (
    <>
      <UserProfileResearch
        {...user}
        userProfileGroupsCard={
          isEnabled('GROUPS') ? (
            <Frame fallback={null}>
              <UserGroups user={user} />
            </Frame>
          ) : undefined
        }
        teams={teams.map((team) => ({
          ...team,
          editHref:
            id === user.id
              ? join(url, 'edit-team-membership', team.id)
              : undefined,
        }))}
        editSkillsHref={id === user.id ? join(url, 'edit-skills') : undefined}
        editQuestionsHref={
          id === user.id ? join(url, 'edit-questions') : undefined
        }
      />
      {id === user.id && (
        <>
          <Route
            path={`${path}/edit-team-membership/:teamId`}
            render={({
              match: {
                params: { teamId },
              },
            }) => {
              const team = teams.find(
                ({ id: currentTeamId }) => currentTeamId === teamId,
              );
              return team ? (
                <TeamMembershipModal
                  {...team}
                  backHref={url}
                  onSave={patchUser}
                />
              ) : (
                <Redirect to={url} />
              );
            }}
          />
          <Route path={`${path}/edit-questions`}>
            <OpenQuestionsModal {...user} backHref={url} onSave={patchUser} />
          </Route>
        </>
      )}
    </>
  );
};

export default Research;
