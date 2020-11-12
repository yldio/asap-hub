import React, { ComponentProps } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { join } from 'path';
import { ProfileResearch } from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';
import { useCurrentUser } from '@asap-hub/react-context';

type ResearchProps = {
  userProfile: UserResponse;
  teams: ComponentProps<typeof ProfileResearch>['teams'];
};
const Research: React.FC<ResearchProps> = ({ userProfile, teams }) => {
  const { id } = useCurrentUser() ?? {};
  const { url } = useRouteMatch();
  return (
    <ProfileResearch
      {...userProfile}
      teams={teams}
      editSkillsHref={
        id === userProfile.id ? join(url, 'edit-skills') : undefined
      }
      editQuestionsHref={
        id === userProfile.id ? join(url, 'edit-questions') : undefined
      }
      editBackgroundHref={
        id === userProfile.id ? join(url, 'edit-background') : undefined
      }
    />
  );
};

export default Research;
