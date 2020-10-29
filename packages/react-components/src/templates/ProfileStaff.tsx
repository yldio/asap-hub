import React, { ComponentProps } from 'react';
import css from '@emotion/css';
import { UserResponse } from '@asap-hub/model';

import { perRem } from '../pixels';
import {
  ProfileSkills,
  QuestionsSection,
  ProfileBackground,
  ProfileBiography,
  ProfileRecentWorks,
} from '../organisms';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type ProfileInterestProps = ComponentProps<typeof QuestionsSection> &
  ComponentProps<typeof ProfileSkills> &
  Pick<UserResponse, 'email'> & {
    readonly biography?: ComponentProps<typeof ProfileBiography>['biography'];
    readonly orcidWorks?: ComponentProps<
      typeof ProfileRecentWorks
    >['orcidWorks'];
    readonly teams: ReadonlyArray<
      Omit<ComponentProps<typeof ProfileBackground>, 'firstName'>
    >;
  };

const ProfileStaff: React.FC<ProfileInterestProps> = ({
  biography,
  firstName,
  teams,
  skills,
  skillsDescription,
  orcidWorks,
  questions,
}) => {
  return (
    <div css={styles}>
      {teams.length
        ? teams.map((team) => (
            <ProfileBackground key={team.id} {...team} firstName={firstName} />
          ))
        : null}
      {biography ? <ProfileBiography biography={biography} /> : null}
      {skills.length ? (
        <ProfileSkills skillsDescription={skillsDescription} skills={skills} />
      ) : null}
      {questions.length ? (
        <QuestionsSection firstName={firstName} questions={questions} />
      ) : null}
      {orcidWorks && orcidWorks.length ? (
        <ProfileRecentWorks orcidWorks={orcidWorks} />
      ) : null}
    </div>
  );
};

export default ProfileStaff;
