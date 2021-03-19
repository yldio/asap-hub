import React from 'react';
import { useRouteMatch, Route, Redirect } from 'react-router-dom';
import {
  UserProfileResearch,
  TeamMembershipModal,
  OpenQuestionsModal,
} from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';
import { useCurrentUser } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';

import { usePatchUserById } from './state';
import Frame from '../../structure/Frame';
import GroupsCard from './groups/GroupsCard';

type ResearchProps = {
  user: UserResponse;
};
const Research: React.FC<ResearchProps> = ({ user }) => {
  const { id } = useCurrentUser() ?? {};

  const { path } = useRouteMatch();
  const route = network({}).users({}).user({ userId: user.id }).research({});

  const patchUser = usePatchUserById(user.id);

  return (
    <>
      <UserProfileResearch
        {...user}
        userProfileGroupsCard={
          <Frame fallback={null}>
            <GroupsCard user={user} />
          </Frame>
        }
        teams={user.teams.map((team) => ({
          ...team,
          editHref:
            id === user.id
              ? route.editTeamMembership({ teamId: team.id }).$
              : undefined,
        }))}
        editSkillsHref={id === user.id ? route.editSkills({}).$ : undefined}
        editQuestionsHref={
          id === user.id ? route.editQuestions({}).$ : undefined
        }
      />
      {id === user.id && (
        <>
          <Route
            path={path + route.editTeamMembership.template}
            render={({
              match: {
                params: { teamId },
              },
            }) => {
              const team = user.teams.find(
                ({ id: currentTeamId }) => currentTeamId === teamId,
              );
              return team ? (
                <TeamMembershipModal
                  {...team}
                  backHref={route.$}
                  onSave={patchUser}
                />
              ) : (
                <Redirect to={route.$} />
              );
            }}
          />
          <Route path={path + route.editQuestions.template}>
            <OpenQuestionsModal
              {...user}
              backHref={route.$}
              onSave={patchUser}
            />
          </Route>
        </>
      )}
    </>
  );
};

export default Research;
