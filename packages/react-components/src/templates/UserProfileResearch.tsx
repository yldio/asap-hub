import { ComponentProps, ReactNode } from 'react';
import { UserResponse } from '@asap-hub/model';

import {
  UserProfileBackground,
  ProfileExpertiseAndResources,
  QuestionsSection,
  ProfileCardList,
} from '../organisms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../mail';

type UserProfileResearchProps = ComponentProps<typeof QuestionsSection> &
  ComponentProps<typeof ProfileExpertiseAndResources> &
  Pick<
    ComponentProps<typeof UserProfileBackground>,
    'firstName' | 'displayName'
  > &
  Pick<UserResponse, 'email' | 'contactEmail' | 'labs'> & {
    readonly teams: ReadonlyArray<
      Omit<
        ComponentProps<typeof UserProfileBackground>,
        'firstName' | 'labs'
      > & {
        editHref?: string;
      }
    >;
  } & {
    userProfileGroupsCard?: ReactNode;
    editExpertiseAndResourcesHref?: string;
    editQuestionsHref?: string;
    isOwnProfile?: boolean;
  };

const UserProfileResearch: React.FC<UserProfileResearchProps> = ({
  firstName,
  displayName,
  email,
  contactEmail,
  teams,
  expertiseAndResourceTags,
  expertiseAndResourceDescription,
  questions,
  isOwnProfile,
  labs,

  userProfileGroupsCard,
  editExpertiseAndResourcesHref,
  editQuestionsHref,
}) => (
  <ProfileCardList>
    {[
      ...teams.map((team) => ({
        card: (
          <UserProfileBackground
            key={team.id}
            {...team}
            firstName={firstName}
            labs={labs}
          />
        ),
        editLink:
          team.editHref !== undefined
            ? {
                href: team.editHref,
                label: `Edit role on ${team.displayName}`,
              }
            : undefined,
      })),
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
        card: <QuestionsSection firstName={firstName} questions={questions} />,
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

export default UserProfileResearch;
