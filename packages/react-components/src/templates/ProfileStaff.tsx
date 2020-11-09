import React, { ComponentProps } from 'react';
import { UserResponse } from '@asap-hub/model';

import {
  ProfileSkills,
  QuestionsSection,
  ProfileBackground,
  ProfileBiography,
  ProfileRecentWorks,
  ProfileStaffBackground,
  HelpSection,
  ProfileCardList,
} from '../organisms';

type ProfileStaffProps = ComponentProps<typeof ProfileStaffBackground> &
  ComponentProps<typeof QuestionsSection> &
  ComponentProps<typeof ProfileSkills> &
  Pick<UserResponse, 'email'> & {
    readonly biography?: ComponentProps<typeof ProfileBiography>['biography'];
    readonly orcidWorks?: ComponentProps<
      typeof ProfileRecentWorks
    >['orcidWorks'];
    readonly teams: ReadonlyArray<
      Omit<ComponentProps<typeof ProfileBackground>, 'firstName'>
    >;
    readonly discoverHref: string;
  };

const ProfileStaff: React.FC<ProfileStaffProps> = ({
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
          <ProfileStaffBackground
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
              <ProfileBackground
                key={team.id}
                {...team}
                firstName={firstName}
              />
            ))
          : null,
      }}
      {{ card: biography ? <ProfileBiography biography={biography} /> : null }}
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
            <ProfileRecentWorks orcidWorks={orcidWorks} />
          ) : null,
      }}
      {{
        card: <HelpSection />,
      }}
    </ProfileCardList>
  );
};

export default ProfileStaff;
