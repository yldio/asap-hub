import React, { ComponentProps } from 'react';
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
  Pick<UserResponse, 'email'> & {
    readonly biography?: ComponentProps<
      typeof UserProfileBiography
    >['biography'];
    readonly orcidWorks?: ComponentProps<
      typeof UserProfileRecentWorks
    >['orcidWorks'];
    readonly teams: ReadonlyArray<
      Omit<ComponentProps<typeof UserProfileBackground>, 'firstName'>
    >;
    readonly discoverHref: string;
  };

const UserProfileStaff: React.FC<UserProfileStaffProps> = ({
  biography,
  firstName,
  teams,
  skills,
  skillsDescription,
  orcidWorks,
  questions,
  discoverHref,
  reachOut,
  responsibilities,
}) => {
  return (
    <ProfileCardList>
      {{
        card: (
          <UserProfileStaffBackground
            firstName={firstName}
            discoverHref={discoverHref}
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
        card: skills.length ? (
          <ProfileSkills
            skillsDescription={skillsDescription}
            skills={skills}
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
};

export default UserProfileStaff;
