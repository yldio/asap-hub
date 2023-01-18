import { gp2 } from '@asap-hub/model';
import {
  Paragraph,
  pixels,
  UserProfilePlaceholderCard,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import EditableCard from '../molecules/EditableCard';
import colors from '../templates/colors';

const { rem } = pixels;

type UserQuestionsProps = {
  questions: gp2.UserResponse['questions'];
  firstName: string;
} & Pick<ComponentProps<typeof EditableCard>, 'editHref'>;

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
  editHref,
}) => (
  <EditableCard
    editHref={editHref}
    title="Open Questions"
    edit={!!questions.length}
    optional
  >
    {editHref && !questions.length ? (
      <UserProfilePlaceholderCard>
        Share the research questions that interest you and drive your work. This
        will give other members a good sense of the kinds of problems that
        you’re interested in solving.
      </UserProfilePlaceholderCard>
    ) : (
      <>
        <div css={[contentStyles]}>
          <Paragraph noMargin accent="lead">
            {firstName} is interested in answering the following questions
            within their work:
          </Paragraph>
        </div>
        {questions.map((question, index) => (
          <div key={`user-question-${index}`} css={rowStyles}>
            <strong>Q:</strong> {question}
          </div>
        ))}
      </>
    )}
  </EditableCard>
);

export default UserQuestions;
