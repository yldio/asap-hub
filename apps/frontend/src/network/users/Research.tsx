import { useRouteMatch, Route, Redirect } from 'react-router-dom';
import {
  UserProfileResearch,
  TeamMembershipModal,
  OpenQuestionsModal,
  SkillsModal,
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
          <Frame title={null} fallback={null}>
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
                <Frame title="Edit Team Membership">
                  <TeamMembershipModal
                    {...team}
                    backHref={route.$}
                    onSave={patchUser}
                  />
                </Frame>
              ) : (
                <Redirect to={route.$} />
              );
            }}
          />
          <Route path={path + route.editQuestions.template}>
            <Frame title="Edit Open Questions">
              <OpenQuestionsModal
                {...user}
                backHref={route.$}
                onSave={patchUser}
              />
            </Frame>
          </Route>
          <Route path={path + route.editSkills.template}>
            <Frame title="Edit Expertise and resources">
              <SkillsModal {...user} backHref={route.$} onSave={patchUser} />
            </Frame>
          </Route>
        </>
      )}
    </>
  );
};

export default Research;
