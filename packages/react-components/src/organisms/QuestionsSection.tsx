import React from 'react';
import { UserResponse } from '@asap-hub/model';
import css from '@emotion/css';

import { Card, Headline2, Headline3, Divider } from '../atoms';

type ProfileSkillsProps = Pick<UserResponse, 'firstName' | 'questions'>;

const containerStyles = css({
  display: 'grid',
});

const ProfileSkills: React.FC<ProfileSkillsProps> = ({
  firstName,
  questions = [],
}) => {
  return (
    <Card>
      <Headline2 styleAsHeading={3}>
        {firstName ? `${firstName}'s Open Questions` : 'Open Questions'}
      </Headline2>
      <div css={containerStyles}>
        {questions.map((question, idx, array) => {
          return (
            <div key={idx}>
              <Headline3 styleAsHeading={4}>Q: {question}</Headline3>
              {idx < array.length - 1 ? <Divider /> : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ProfileSkills;
