import { Frame } from '@asap-hub/frontend-utils';
import { UserPatchRequest, UserResponse } from '@asap-hub/model';
import {
  OpenQuestionsModal,
  RoleModal,
  UserProfileResearch,
  WorkingGroupsTabbedCard,
  UserTeamsTabbedCard,
  ExpertiseAndResourcesModal,
} from '@asap-hub/react-components';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { networkRoutes } from '@asap-hub/routing';
import { Route, useMatch } from 'react-router-dom';

import { usePatchUserById } from './state';
import InterestGroupsCard from './interest-groups/InterestGroupsCard';
import { useResearchTags } from '../../shared-research';

type ResearchProps = {
  user: UserResponse;
};
const Research: React.FC<ResearchProps> = ({ user }) => {
  const researchTagsSuggestions = useResearchTags();

  const { id } = useCurrentUserCRN() ?? {};
  // const { path } = useMatch();
  const route = networkRoutes.DEFAULT.USERS.DETAILS;

  // network({}).users({}).user({ userId: user.id }).research({});

  const patchUser = usePatchUserById(user.id);

  const commonModalProps = {
    backHref: route,
    onSave: (patchedUser: UserPatchRequest) => patchUser(patchedUser),
  };

  return (
    <>
      <UserProfileResearch
        {...user}
        userProfileGroupsCard={
          <Frame title={null} fallback={null}>
            <InterestGroupsCard user={user} />
          </Frame>
        }
        userProfileWorkingGroupsCard={
          <Frame title={null} fallback={null}>
            <WorkingGroupsTabbedCard
              isUserAlumni={!!user.alumniSinceDate}
              groups={user.workingGroups}
            />
          </Frame>
        }
        userProfileTeamsCard={
          <Frame title={null} fallback={null}>
            <UserTeamsTabbedCard
              userAlumni={!!user.alumniSinceDate}
              teams={user.teams}
            />
          </Frame>
        }
        editExpertiseAndResourcesHref={
          id === user.id
            ? route.RESEARCH.EDIT_EXPERTISE_AND_RESOURCES.buildPath({
                id: user.id,
              })
            : undefined
        }
        editQuestionsHref={
          id === user.id
            ? route.RESEARCH.EDIT_QUESTIONS.buildPath({ id: user.id })
            : undefined
        }
        editRoleHref={
          id === user.id
            ? route.RESEARCH.EDIT_ROLE.buildPath({ id: user.id })
            : undefined
        }
        isOwnProfile={id === user.id}
      />
      {id === user.id && (
        <>
          <Route
            path={route.$.RESEARCH.EDIT_ROLE.relativePath}
            element={
              <Frame title="Edit Role">
                <RoleModal
                  {...commonModalProps}
                  teams={user.teams}
                  labs={user.labs}
                  researchInterests={user.researchInterests}
                  responsibilities={user.responsibilities}
                  role={user.role}
                  reachOut={user.reachOut}
                  firstName={user.firstName}
                />
              </Frame>
            }
          />

          <Route
            path={route.$.RESEARCH.EDIT_QUESTIONS.relativePath}
            element={
              <Frame title="Edit Open Questions">
                <OpenQuestionsModal {...user} {...commonModalProps} />
              </Frame>
            }
          />

          <Route
            path={route.$.RESEARCH.EDIT_EXPERTISE_AND_RESOURCES.relativePath}
            element={
              <Frame title="Edit Expertise and Resources">
                <ExpertiseAndResourcesModal
                  {...user}
                  {...commonModalProps}
                  suggestions={researchTagsSuggestions}
                />
              </Frame>
            }
          />
        </>
      )}
    </>
  );
};

export default Research;
