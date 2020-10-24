import React, { ComponentProps } from 'react';
import css from '@emotion/css';
import { UserResponse } from '@asap-hub/model';

import { perRem } from '../pixels';
import {
  ProfileBackground,
  ProfileSkills,
  QuestionsSection,
} from '../organisms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../utils';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type ProfileInterestProps = Pick<
  ComponentProps<typeof ProfileBackground>,
  'firstName' | 'displayName'
> &
  ComponentProps<typeof QuestionsSection> &
  ComponentProps<typeof ProfileSkills> &
  Pick<UserResponse, 'email'> & {
    readonly teams: ReadonlyArray<
      Omit<ComponentProps<typeof ProfileBackground>, 'firstName'>
    >;
  };

const ProfileAbout: React.FC<ProfileInterestProps> = ({
  firstName,
  displayName,
  email,
  teams,
  skills,
  skillsDescription,
  questions,
}) => {
  return (
    <div css={styles}>
      {teams.length
        ? teams.map((team) => (
            <ProfileBackground key={team.id} {...team} firstName={firstName} />
          ))
        : null}
      {skills.length ? (
        <ProfileSkills skillsDescription={skillsDescription} skills={skills} />
      ) : null}
      {questions.length ? (
        <QuestionsSection firstName={firstName} questions={questions} />
      ) : null}
      <CtaCard href={createMailTo(email)} buttonText="Contact">
        <strong>Interested in what you have seen?</strong> <br />
        Why not get in touch with {displayName}?
      </CtaCard>
    </div>
  );
};

export default ProfileAbout;
