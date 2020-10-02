import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import {
  ProfileBackground,
  SkillsSection,
  QuestionsSection,
} from '../organisms';
import { UserResponse } from '../../../model/src';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type ProfileInterestProps = Pick<
  ComponentProps<typeof ProfileBackground>,
  'firstName'
> &
  Pick<UserResponse, 'skills' | 'questions'> & {
    readonly teams: ReadonlyArray<
      Omit<ComponentProps<typeof ProfileBackground>, 'firstName'>
    >;
  };

const ProfileAbout: React.FC<ProfileInterestProps> = ({
  firstName,
  teams,
  skills,
  questions,
}) => {
  return (
    <div css={styles}>
      {teams.length
        ? teams.map((team) => (
            <ProfileBackground key={team.id} {...team} firstName={firstName} />
          ))
        : null}
      {skills.length ? <SkillsSection skills={skills} /> : null}
      {questions.length ? (
        <QuestionsSection firstName={firstName} questions={questions} />
      ) : null}
    </div>
  );
};

export default ProfileAbout;
