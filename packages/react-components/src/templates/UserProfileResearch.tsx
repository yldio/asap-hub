import React, { ComponentProps, ReactNode, useEffect, useState } from 'react';
import { UserResponse } from '@asap-hub/model';

import {
  ProfileExpertiseAndResources,
  QuestionsSection,
  ProfileCardList,
} from '../organisms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../mail';
import UserProfileRole from '../organisms/UserProfileRole';
import { useFlags } from '@asap-hub/react-context';
import { isEnabled, setCurrentOverrides } from '@asap-hub/flags';

//TODO: this type is confusing
type UserProfileResearchProps = ComponentProps<typeof QuestionsSection> &
  ComponentProps<typeof ProfileExpertiseAndResources> &
  Pick<ComponentProps<typeof UserProfileRole>, 'firstName'> &
  Pick<
    UserResponse,
    | 'email'
    | 'contactEmail'
    | 'labs'
    | 'teams'
    | 'displayName'
    | 'researchInterests'
    | 'responsibilities'
  > & {
    userProfileGroupsCard?: ReactNode;
    editExpertiseAndResourcesHref?: string;
    editQuestionsHref?: string;
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
  ...roleProps
}) => {
  const { isEnabled, setCurrentOverrides } = useFlags();
  useEffect(() => {
    setCurrentOverrides();
    console.log(isEnabled('UPDATED_ROLE_SECTION'));
  }, [setCurrentOverrides]);

  return (
    <ProfileCardList>
      {[
        // ...teams.map((team) => ({
        //   card: (
        //     <UserProfileBackground
        //       key={team.id}
        //       {...team}
        //       firstName={firstName}
        //       labs={labs}
        //     />
        //   ),
        //   editLink:
        //     team.editHref !== undefined
        //       ? {
        //           href: team.editHref,
        //           label: `Edit role on ${team.displayName}`,
        //         }
        //       : undefined,
        // })),
        {
          card: (
            <UserProfileRole
              firstName={firstName}
              labs={labs}
              {...roleProps}
            ></UserProfileRole>
          ),
        },
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
