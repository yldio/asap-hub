import { gp2 as gp2Model } from '@asap-hub/model';
import { Button, pixels, TextArea } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import { addIcon, binIcon } from '../icons';
import { mobileQuery } from '../layout';
import colors from '../templates/colors';
import EditUserModal from './EditUserModal';

const { rem } = pixels;

const containerStyles = css({
  [mobileQuery]: {
    display: 'unset',
  },
  display: 'flex',
  paddingBottom: rem(8),
  flexDirection: 'column',
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

const headerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const buttonStyles = css({ margin: 0 });

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
  const checkDirty = () =>
    newQuestions.some((question, index) => question !== questions[index]);

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
      description="Share the research questions that interest you and drive your work. Other members will be able to respond to you privately using your email."
      onSave={() => onSave({ questions: newQuestions })}
      backHref={backHref}
      dirty={checkDirty()}
    >
      {({ isSaving }) => (
        <>
          <div css={[containerStyles]}>
            <div css={{ paddingBottom: '0' }}>
              {newQuestions.map((question, index) => (
                <div css={[rowStyles]} key={`question-${index}`}>
                  <div css={headerStyles}>
                    <p>
                      <strong>Question {index + 1}</strong> {optional}
                    </p>
                    <div css={buttonStyles}>
                      <Button onClick={onRemove(index)} small>
                        <span css={css({ display: 'inline-flex' })}>
                          {binIcon}
                        </span>
                      </Button>
                    </div>
                  </div>
                  <TextArea
                    enabled={!isSaving}
                    value={question}
                    onChange={onChangeValue(index)}
                    maxLength={250}
                    placeholder={
                      'Example: Are alpha-synuclein deposits the cause or consequence of something deeper wrong with neurons?'
                    }
                  />
                </div>
              ))}
            </div>
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
                    Add Another Question
                    {addIcon}
                  </span>
                </Button>
              </div>
            ) : undefined}
          </div>
        </>
      )}
    </EditUserModal>
  );
};

export default OpenQuestionsModal;
