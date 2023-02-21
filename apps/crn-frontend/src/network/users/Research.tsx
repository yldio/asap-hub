import { Frame } from '@asap-hub/frontend-utils';
import { UserResponse } from '@asap-hub/model';
import {
  ExpertiseAndResourcesModal,
  OpenQuestionsModal,
  RoleModal,
  UserProfileResearch,
  WorkingGroupsTabbedCard,
  UserTeamsTabbedCard,
} from '@asap-hub/react-components';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import { Route, useRouteMatch } from 'react-router-dom';

import { usePatchUserById } from './state';

import expertiseAndResourceSuggestions from './expertise-and-resource-suggestions';
import GroupsCard from './groups/GroupsCard';

type ResearchProps = {
  user: UserResponse;
};
const Research: React.FC<ResearchProps> = ({ user }) => {
  const { id } = useCurrentUserCRN() ?? {};
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
        userProfileWorkingGroupsCard={
          <Frame title={null} fallback={null}>
            <WorkingGroupsTabbedCard
              userName={user.displayName}
              isUserAlumni={!!user.alumniSinceDate}
              groups={user.workingGroups}
            />
          </Frame>
        }
        userProfileTeamsCard={
          <Frame title={null} fallback={null}>
            <UserTeamsTabbedCard
              userName={user.displayName}
              isUserAlumni={!!user.alumniSinceDate}
              teams={user.teams}
            />
          </Frame>
        }
        editExpertiseAndResourcesHref={
          id === user.id ? route.editExpertiseAndResources({}).$ : undefined
        }
        editQuestionsHref={
          id === user.id ? route.editQuestions({}).$ : undefined
        }
        editRoleHref={id === user.id ? route.editRole({}).$ : undefined}
        isOwnProfile={id === user.id}
      />
      {id === user.id && (
        <>
          <Route path={path + route.editRole.template}>
            <Frame title="Edit Role">
              <RoleModal
                teams={user.teams}
                labs={user.labs}
                backHref={route.$}
                onSave={patchUser}
                researchInterests={user.researchInterests}
                responsibilities={user.responsibilities}
                role={user.role}
                reachOut={user.reachOut}
                firstName={user.firstName}
              />
            </Frame>
          </Route>
          <Route path={path + route.editQuestions.template}>
            <Frame title="Edit Open Questions">
              <OpenQuestionsModal
                {...user}
                backHref={route.$}
                onSave={patchUser}
              />
            </Frame>
          </Route>
          <Route path={path + route.editExpertiseAndResources.template}>
            <Frame title="Edit Expertise and Resources">
              <ExpertiseAndResourcesModal
                {...user}
                expertiseAndResourceSuggestions={
                  expertiseAndResourceSuggestions
                }
                backHref={route.$}
                onSave={patchUser}
              />
            </Frame>
          </Route>
        </>
      )}
    </>
  );
};

export default Research;
