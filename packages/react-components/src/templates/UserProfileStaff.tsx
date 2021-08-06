import { ComponentProps } from 'react';
import { UserResponse } from '@asap-hub/model';

import {
  ProfileSkills,
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
  ComponentProps<typeof ProfileSkills> &
  Pick<UserResponse, 'email' | 'labs'> & {
    readonly biography?: ComponentProps<
      typeof UserProfileBiography
    >['biography'];
    readonly orcidWorks?: ComponentProps<
      typeof UserProfileRecentWorks
    >['orcidWorks'];
    readonly teams: ReadonlyArray<
      Omit<ComponentProps<typeof UserProfileBackground>, 'firstName'>
    >;
  };

const UserProfileStaff: React.FC<UserProfileStaffProps> = ({
  biography,
  firstName,
  teams,
  skills,
  skillsDescription,
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
              labs={labs}
            />
          ))
        : null,
    }}
    {{
      card: biography ? <UserProfileBiography biography={biography} /> : null,
    }}
    {{
      card: skills.length ? (
        <ProfileSkills skillsDescription={skillsDescription} skills={skills} />
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
