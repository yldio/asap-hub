import { useState } from 'react';
import { UserPatchRequest, UserResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import deepEqual from 'fast-deep-equal';

import { LabeledTextArea } from '../molecules';
import { noop } from '../utils';
import { perRem } from '../pixels';
import { Paragraph } from '../atoms';
import { EditUserModal } from '../organisms';

const fieldsContainerStyles = css({
  display: 'grid',
  columnGap: `${24 / perRem}em`,
});

type OpenQuestionsModalProps = Pick<UserResponse, 'questions'> & {
  onSave?: (data: UserPatchRequest) => void | Promise<void>;
  backHref: string;
};

const OpenQuestionsModal: React.FC<OpenQuestionsModalProps> = ({
  questions,
  onSave = noop,
  backHref,
}) => {
  const [newQuestions, setNewQuestions] = useState<string[]>(questions);

  return (
    <EditUserModal
      title="Open Questions"
      dirty={!deepEqual(newQuestions, questions)}
      backHref={backHref}
      onSave={() =>
        onSave({
          questions: newQuestions.filter((item) => item.trim() !== ''),
        })
      }
    >
      {({ isSaving }) => (
        <>
          <Paragraph accent="lead">
            Share questions that drive your work or get you out of bed in the
            morning. Help other ASAP researchers get to know you and spark
            discussions and collaborations in the Network!
          </Paragraph>
          <div css={[fieldsContainerStyles]}>
            <LabeledTextArea
              required
              title="Open Question 1"
              subtitle="(required)"
              placeholder="Example: Are alpha-synuclein deposits the cause or consequence of something deeper wrong with neurons?"
              getValidationMessage={() => 'Please add your first Open Question'}
              maxLength={200}
              enabled={!isSaving}
              onChange={(newValue) =>
                setNewQuestions(
                  Object.assign([], newQuestions, { 0: newValue }),
                )
              }
              value={newQuestions[0] || ''}
            />
            <LabeledTextArea
              required
              title="Open Question 2"
              subtitle="(required)"
              placeholder="Does alpha-synuclein represent a pathologically relevant stimulator of microglial activation?"
              getValidationMessage={() =>
                'Please add your second Open Question'
              }
              maxLength={200}
              enabled={!isSaving}
              onChange={(newValue) =>
                setNewQuestions(
                  Object.assign([], newQuestions, { 1: newValue }),
                )
              }
              value={newQuestions[1] || ''}
            />
            <LabeledTextArea
              title="Open Question 3"
              subtitle="(optional)"
              placeholder="Example: To what extent do pre-formed fibrils (PFFs) of alpha-synuclein alter neuronal (synaptic) activity prior to neuronal loss?"
              maxLength={200}
              enabled={!isSaving}
              onChange={(newValue) =>
                setNewQuestions(
                  Object.assign([], newQuestions, { 2: newValue }),
                )
              }
              value={newQuestions[2] || ''}
            />
            <LabeledTextArea
              title="Open Question 4"
              subtitle="(optional)"
              placeholder="Example: Is it possible that LRRK2 alters the expression of multiple different miRNAs in different systems?"
              maxLength={200}
              enabled={!isSaving}
              onChange={(newValue) =>
                setNewQuestions(
                  Object.assign([], newQuestions, { 3: newValue }),
                )
              }
              value={newQuestions[3] || ''}
            />
          </div>
        </>
      )}
    </EditUserModal>
  );
};

export default OpenQuestionsModal;
