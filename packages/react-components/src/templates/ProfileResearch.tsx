import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import {
  ProfileBackground,
  SkillsSection,
  QuestionsSection,
} from '../organisms';
import { UserResponse } from '../../../model/src';
import { Card, Paragraph, Link } from '../atoms';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

const getInTouchStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${12 / perRem}em ${24 / perRem}em`,
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
      <Card padding={false} accent="green">
        <div css={getInTouchStyles}>
          <Paragraph>
            <strong>Interested in what you have seen?</strong> Why not get in
            touch with {displayName}?
          </Paragraph>
          <Link buttonStyle primary small href={`mailto:${email}`}>
            Contact
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ProfileAbout;
