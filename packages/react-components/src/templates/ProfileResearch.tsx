import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import {
  ProfileBackground,
  SkillsSection,
  QuestionsSection,
} from '../organisms';
import { UserResponse } from '../../../model/src';
import { Paragraph } from '../atoms';
import { CtaCard } from '../molecules';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type ProfileInterestProps = Pick<
  ComponentProps<typeof ProfileBackground>,
  'firstName' | 'displayName'
> &
  Pick<UserResponse, 'skills' | 'questions' | 'email'> & {
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
      <CtaCard href={`mailto:${email}`} buttonText="Contact">
        <Paragraph>
          <strong>Interested in what you have seen?</strong> Why not get in
          touch with {displayName}?
        </Paragraph>
      </CtaCard>
    </div>
  );
};

export default ProfileAbout;
