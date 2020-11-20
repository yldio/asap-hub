import React, { ComponentProps } from 'react';
import { useRouteMatch, useHistory, Route, Redirect } from 'react-router-dom';
import { join } from 'path';
import {
  ProfileResearch,
  TeamMembershipModal,
} from '@asap-hub/react-components';
import { UserResponse, UserPatchRequest } from '@asap-hub/model';
import { useCurrentUser } from '@asap-hub/react-context';

type ResearchProps = {
  userProfile: UserResponse;
  teams: ComponentProps<typeof ProfileResearch>['teams'];
  onPatchUserProfile: (patch: UserPatchRequest) => void | Promise<void>;
};
const Research: React.FC<ResearchProps> = ({
  userProfile,
  teams,
  onPatchUserProfile,
}) => {
  const { id } = useCurrentUser() ?? {};
  const { url, path } = useRouteMatch();
  const history = useHistory();
  return (
    <>
      <ProfileResearch
        {...userProfile}
        teams={teams.map((team) => ({
          ...team,
          editHref:
            id === userProfile.id
              ? join(url, 'edit-team-membership', team.id)
              : undefined,
        }))}
        editSkillsHref={
          id === userProfile.id ? join(url, 'edit-skills') : undefined
        }
        editQuestionsHref={
          id === userProfile.id ? join(url, 'edit-questions') : undefined
        }
      />
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
              onSave={async (data) => {
                await onPatchUserProfile(data);
                history.push(url);
              }}
            />
          ) : (
            <Redirect to={url} />
          );
        }}
      />
    </>
  );
};

export default Research;
