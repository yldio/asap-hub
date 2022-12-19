import { gp2 } from '@asap-hub/model';
import { Headline3, Paragraph, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';

const { rem } = pixels;

type UserQuestionsProps = {
  questions: gp2.UserResponse['questions'];
  firstName: string;
};

const contentStyles = css({
  padding: `${rem(16)} 0`,
});

const UserQuestions: React.FC<UserQuestionsProps> = ({
  questions,
  firstName,
}) => (
  <>
    <Headline3 noMargin>Open Questions</Headline3>
    <div css={[contentStyles]}>
      <Paragraph hasMargin={false} accent="lead">
        {firstName} is interested in answering the following questions within
        their work:
      </Paragraph>
    </div>
    {questions.map((question, index) => (
      <div key={`user-question-${index}`}>Q: {question}</div>
    ))}
  </>
);

export default UserQuestions;
