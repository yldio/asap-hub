import { gp2 as gp2Model } from '@asap-hub/model';
import { Button, pixels, TextArea } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import { addIcon, binIcon } from '../icons';
import { mobileQuery } from '../layout';
import EditUserModal from './EditUserModal';

const { rem } = pixels;

const headerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const addButtonStyles = css({
  width: 'fit-content',
  [mobileQuery]: {
    width: '100%',
  },
});

const optional = '(optional)';

type OpenQuestionsModalProps = Pick<gp2Model.UserResponse, 'questions'> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    onSave: (userData: gp2Model.UserPatchRequest) => Promise<void>;
  };

const OpenQuestionsModal: React.FC<OpenQuestionsModalProps> = ({
  questions,
  backHref,
  onSave,
}) => {
  const [newQuestions, setQuestions] = useState(
    !questions.length ? [''] : questions,
  );
  const checkDirty = () => {
    if (
      !questions.length &&
      newQuestions.length === 1 &&
      newQuestions[0] === ''
    ) {
      return false;
    }
    return newQuestions.some(
      (question, index) => question !== questions[index],
    );
  };

  const onChangeValue = (index: number) => (value: string) =>
    setQuestions(
      Object.assign([], newQuestions, {
        [index]: value,
      }),
    );
  const onRemove = (index: number) => () =>
    setQuestions(newQuestions.filter((_, idx) => idx !== index));
  const onAdd = () => setQuestions([...newQuestions, '']);

  return (
    <EditUserModal
      title="Open Questions"
      description="Share the research questions that interest you and drive your work (up to five). This will give other members a good sense of the kinds of problems that you’re interested in solving."
      onSave={() => onSave({ questions: newQuestions.filter(Boolean) })}
      backHref={backHref}
      dirty={checkDirty()}
    >
      {({ isSaving }) => (
        <>
          {newQuestions.map((question, index) => (
            <div key={`question-${index}`}>
              <div css={headerStyles}>
                <p>
                  <strong>Question {index + 1}</strong> {optional}
                </p>
                <div css={{ margin: 0 }}>
                  <Button onClick={onRemove(index)} small>
                    <span css={{ display: 'inline-flex' }}>{binIcon}</span>
                  </Button>
                </div>
              </div>
              <TextArea
                enabled={!isSaving}
                value={question}
                onChange={onChangeValue(index)}
                maxLength={250}
                getValidationMessage={() => 'Please enter a question'}
                placeholder={
                  'Example: Are alpha-synuclein deposits the cause or consequence of something deeper wrong with neurons?'
                }
              />
            </div>
          ))}
          {newQuestions.length < 5 ? (
            <div css={addButtonStyles}>
              <Button onClick={onAdd} enabled={!isSaving} small>
                <span
                  css={{
                    display: 'inline-flex',
                    gap: rem(8),
                    margin: `0 ${rem(3)}`,
                  }}
                >
                  {newQuestions.length > 0
                    ? 'Add Another Question'
                    : 'Add Open Question'}
                  {addIcon}
                </span>
              </Button>
            </div>
          ) : undefined}
        </>
      )}
    </EditUserModal>
  );
};

export default OpenQuestionsModal;
