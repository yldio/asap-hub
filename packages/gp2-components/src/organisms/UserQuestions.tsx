import { gp2 } from '@asap-hub/model';
import { Paragraph, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import colors from '../templates/colors';

const { rem } = pixels;

type UserQuestionsProps = {
  questions: gp2.UserResponse['questions'];
  firstName: string;
};

const contentStyles = css({
  padding: `${rem(16)} 0`,
});

const rowStyles = css({
  borderBottom: `1px solid ${colors.neutral500.rgb}`,
  marginBottom: rem(12),
  padding: `${rem(16)} 0`,
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: 0,
  },
});
const UserQuestions: React.FC<UserQuestionsProps> = ({
  questions,
  firstName,
}) => (
  <>
    <div css={[contentStyles]}>
      <Paragraph margin={false} accent="lead">
        {firstName} is interested in answering the following questions within
        their work:
      </Paragraph>
    </div>
    {questions.map((question, index) => (
      <div key={`user-question-${index}`} css={rowStyles}>
        <strong>Q:</strong> {question}
      </div>
    ))}
  </>
);

export default UserQuestions;
