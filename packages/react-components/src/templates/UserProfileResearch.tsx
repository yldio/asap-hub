import React, { ComponentProps, ReactNode } from 'react';
import { UserResponse, UserTeam } from '@asap-hub/model';

import {
  ProfileExpertiseAndResources,
  QuestionsSection,
  ProfileCardList,
  UserProfileBackground,
} from '../organisms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../mail';
import UserProfileRole from '../organisms/UserProfileRole';

type UserProfileResearchProps = ComponentProps<typeof QuestionsSection> &
  ComponentProps<typeof ProfileExpertiseAndResources> &
  Pick<
    ComponentProps<typeof UserProfileBackground>,
    'firstName' | 'displayName'
  > &
  Pick<
    UserResponse,
    'email' | 'contactEmail' | 'labs' | 'researchInterests' | 'responsibilities'
  > & {
    teams: Array<
      UserTeam & {
        editHref?: string;
      }
    >;
  } & {
    userProfileGroupsCard?: ReactNode;
    editExpertiseAndResourcesHref?: string;
    editQuestionsHref?: string;
    editRoleHref?: string;
    isOwnProfile?: boolean;
  };

const UserProfileResearch: React.FC<UserProfileResearchProps> = ({
  firstName,
  email,
  contactEmail,
  expertiseAndResourceTags,
  expertiseAndResourceDescription,
  questions,
  isOwnProfile,
  labs,
  displayName,
  userProfileGroupsCard,
  editExpertiseAndResourcesHref,
  editQuestionsHref,
  editRoleHref,
  teams,
  ...roleProps
}) => {
  const isRoleEmpty =
    !labs.length &&
    !teams.length &&
    !roleProps.researchInterests &&
    !roleProps.responsibilities;
  const showRoleSection = isOwnProfile ? true : !isRoleEmpty;
  const roleSection = [
    showRoleSection && {
      card: (
        <UserProfileRole
          firstName={firstName}
          labs={labs}
          teams={teams}
          {...roleProps}
        />
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

  return (
    <ProfileCardList>
      {[
        ...roleSection,
        {
          card: (
            <ProfileExpertiseAndResources
              expertiseAndResourceDescription={expertiseAndResourceDescription}
              expertiseAndResourceTags={expertiseAndResourceTags}
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
        {
          card: (
            <QuestionsSection firstName={firstName} questions={questions} />
          ),
          editLink:
            editQuestionsHref === undefined
              ? undefined
              : {
                  href: editQuestionsHref,
                  label: 'Edit open questions',
                },
        },
        userProfileGroupsCard !== undefined && {
          card: userProfileGroupsCard,
        },
        isOwnProfile || {
          card: (
            <CtaCard
              href={createMailTo(contactEmail || email)}
              buttonText="Contact"
            >
              <strong>Interested in what you have seen?</strong> <br />
              Why not get in touch with {displayName}?
            </CtaCard>
          ),
        },
      ]}
    </ProfileCardList>
  );
};

export default UserProfileResearch;
