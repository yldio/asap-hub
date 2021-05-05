import React, { useContext } from 'react';
import { UserResponse } from '@asap-hub/model';
import css from '@emotion/css';
import { UserProfileContext } from '@asap-hub/react-context';

import { Card, Headline2, Headline3, Divider } from '../atoms';
import UserProfilePlaceholderCard from './UserProfilePlaceholderCard';

type QuestionsSectionProps = Pick<UserResponse, 'firstName' | 'questions'>;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
});

const QuestionsSection: React.FC<QuestionsSectionProps> = ({
  firstName,
  questions = [],
}) => {
  const { isOwnProfile } = useContext(UserProfileContext);
  return questions.length || isOwnProfile ? (
    <Card>
      <Headline2 styleAsHeading={3}>
        {firstName ? `${firstName}'s Open Questions` : 'Open Questions'}
      </Headline2>
      {questions.length ? (
        <div css={containerStyles}>
          {questions
            .flatMap((question, idx) => {
              const component = (
                <Headline3 key={`q-${idx}`} styleAsHeading={4}>
                  {question}
                </Headline3>
              );
              return [<Divider key={`sep-${idx}`} />, component];
            })
            .slice(1)}
        </div>
      ) : (
        <UserProfilePlaceholderCard title="Which burning research questions are you aiming to clarify within the Parkinson’s space?">
          Share the research questions that interest you and drive your work.
        </UserProfilePlaceholderCard>
      )}
    </Card>
  ) : null;
};

export default QuestionsSection;
