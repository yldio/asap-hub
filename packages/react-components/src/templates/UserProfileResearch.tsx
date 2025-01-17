import React, { ComponentProps, ReactNode } from 'react';
import { UserResponse } from '@asap-hub/model';

import {
  ProfileExpertiseAndResources,
  QuestionsSection,
  ProfileCardList,
  HelpSection,
} from '../organisms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../mail';
import UserProfileRole from '../organisms/UserProfileRole';

type UserProfileResearchProps = ComponentProps<typeof QuestionsSection> &
  ComponentProps<typeof ProfileExpertiseAndResources> &
  Pick<
    UserResponse,
    'email' | 'contactEmail' | 'displayName' | 'alumniSinceDate'
  > &
  ComponentProps<typeof UserProfileRole> & {
    userProfileGroupsCard?: ReactNode;
    userProfileWorkingGroupsCard?: ReactNode;
    userProfileTeamsCard?: ReactNode;
    editExpertiseAndResourcesHref?: string;
    editQuestionsHref?: string;
    editRoleHref?: string;
    isOwnProfile?: boolean;
  };

const UserProfileResearch: React.FC<UserProfileResearchProps> = ({
  firstName,
  email,
  contactEmail,
  alumniSinceDate,
  expertiseAndResourceDescription,
  questions,
  isOwnProfile,
  displayName,
  userProfileGroupsCard,
  userProfileWorkingGroupsCard,
  userProfileTeamsCard,
  editExpertiseAndResourcesHref,
  editQuestionsHref,
  editRoleHref,
  role,
  tags,
  ...roleProps
}) => {
  const isRoleEmpty =
    !roleProps.researchInterests && !roleProps.responsibilities;
  const showRoleSection = isOwnProfile ? true : !isRoleEmpty;
  const roleSection = [
    showRoleSection && {
      card: (
        <UserProfileRole firstName={firstName} role={role} {...roleProps} />
      ),
      editLink:
        editRoleHref === undefined
          ? undefined
          : {
              href: editRoleHref,
              label: 'Edit team role',
            },
    },
  ];
  const staffCards = [
    userProfileWorkingGroupsCard !== undefined && {
      card: userProfileWorkingGroupsCard,
    },
    userProfileTeamsCard !== undefined && {
      card: userProfileTeamsCard,
    },
    !isOwnProfile && {
      card: <HelpSection />,
    },
  ];
  const defaultCards = [
    {
      card: <QuestionsSection questions={questions} />,
      editLink:
        editQuestionsHref === undefined
          ? undefined
          : {
              href: editQuestionsHref,
              label: 'Edit open questions',
            },
    },
    userProfileWorkingGroupsCard !== undefined && {
      card: userProfileWorkingGroupsCard,
    },
    userProfileGroupsCard !== undefined && {
      card: userProfileGroupsCard,
    },
    userProfileTeamsCard !== undefined && {
      card: userProfileTeamsCard,
    },
    !isOwnProfile &&
      !alumniSinceDate && {
        card: (
          <CtaCard
            href={createMailTo(contactEmail || email)}
            buttonText="Contact"
            displayCopy
          >
            <strong>Have additional questions?</strong> <br />
            {displayName} is available to help.
          </CtaCard>
        ),
      },
  ];
  return (
    <ProfileCardList>
      {[
        ...roleSection,
        {
          card: (
            <ProfileExpertiseAndResources
              expertiseAndResourceDescription={expertiseAndResourceDescription}
              tags={tags}
            />
          ),

          editLink:
            editExpertiseAndResourcesHref === undefined
              ? undefined
              : {
                  href: editExpertiseAndResourcesHref,
                  label: 'Edit expertise and resources',
                },
        },
        ...(role === 'Staff' ? staffCards : defaultCards),
      ]}
    </ProfileCardList>
  );
};

export default UserProfileResearch;
