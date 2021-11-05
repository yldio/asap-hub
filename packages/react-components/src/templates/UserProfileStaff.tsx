import { ComponentProps } from 'react';
import { UserResponse } from '@asap-hub/model';

import {
  ProfileExpertiseAndResources,
  QuestionsSection,
  UserProfileBackground,
  UserProfileBiography,
  UserProfileRecentWorks,
  UserProfileStaffBackground,
  HelpSection,
  ProfileCardList,
} from '../organisms';

type UserProfileStaffProps = ComponentProps<typeof UserProfileStaffBackground> &
  ComponentProps<typeof QuestionsSection> &
  ComponentProps<typeof ProfileExpertiseAndResources> &
  Pick<UserResponse, 'email' | 'labs'> & {
    readonly biography?: ComponentProps<
      typeof UserProfileBiography
    >['biography'];
    readonly orcidWorks?: ComponentProps<
      typeof UserProfileRecentWorks
    >['orcidWorks'];
    readonly teams: ReadonlyArray<
      Omit<ComponentProps<typeof UserProfileBackground>, 'firstName' | 'labs'>
    >;
  };

const UserProfileStaff: React.FC<UserProfileStaffProps> = ({
  biography,
  firstName,
  teams,
  expertiseAndResourceTags,
  expertiseAndResourceDescription,
  orcidWorks,
  questions,
  reachOut,
  responsibilities,
  labs,
}) => (
  <ProfileCardList>
    {{
      card: (
        <UserProfileStaffBackground
          firstName={firstName}
          reachOut={reachOut}
          responsibilities={responsibilities}
        />
      ),
    }}
    {{
      card: teams.length
        ? teams.map((team) => (
            <UserProfileBackground
              key={team.id}
              {...team}
              firstName={firstName}
            />
          ))
        : null,
    }}
    {{
      card: biography ? <UserProfileBiography biography={biography} /> : null,
    }}
    {{
      card: expertiseAndResourceTags.length ? (
        <ProfileExpertiseAndResources
          expertiseAndResourceDescription={expertiseAndResourceDescription}
          expertiseAndResourceTags={expertiseAndResourceTags}
        />
      ) : null,
    }}
    {{
      card: questions.length ? (
        <QuestionsSection firstName={firstName} questions={questions} />
      ) : null,
    }}
    {{
      card:
        orcidWorks && orcidWorks.length ? (
          <UserProfileRecentWorks orcidWorks={orcidWorks} />
        ) : null,
    }}
    {{
      card: <HelpSection />,
    }}
  </ProfileCardList>
);

export default UserProfileStaff;
