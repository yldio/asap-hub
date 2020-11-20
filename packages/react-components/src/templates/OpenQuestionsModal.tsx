import React, { useRef, useState } from 'react';
import { UserPatchRequest, UserResponse } from '@asap-hub/model';
import css from '@emotion/css';

import ModalEditHeader from '../molecules/ModalEditHeader';
import { LabeledTextArea } from '../molecules';
import { noop } from '../utils';
import { perRem } from '../pixels';
import { Modal } from '../organisms';
import { Paragraph } from '../atoms';

const fieldsContainerStyles = css({
  display: 'grid',
  columnGap: `${24 / perRem}em`,
});

type OpenQuestionsModalProps = Pick<UserResponse, 'questions'> & {
  onSave?: (data: UserPatchRequest) => Promise<void>;
  backHref: string;
};

const OpenQuestionsModal: React.FC<OpenQuestionsModalProps> = ({
  questions,
  onSave = noop,
  backHref,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [newQuestions, setNewQuestions] = useState<string[]>(questions);
  return (
    <Modal>
      <form ref={formRef}>
        <ModalEditHeader
          backHref={backHref}
          onSave={() => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (formRef.current!.reportValidity()) {
              onSave({
                questions: newQuestions.filter((item) => item.trim() !== ''),
              });
            }
          }}
          title="Your Open Questions"
        />
        <Paragraph accent="lead">
          Share questions that drive your work or get you out of bed in the
          morning. Help other ASAP researchers get to know you and spark
          discussions and collaborations in the Network!
        </Paragraph>
        <div css={[fieldsContainerStyles]}>
          <LabeledTextArea
            title="Open Question 1"
            placeholder="Example: Are alpha-synuclein deposits the cause or consequence of something deeper wrong with neurons?"
            maxLength={200}
            onChange={(newValue) =>
              setNewQuestions(Object.assign([], newQuestions, { 0: newValue }))
            }
            value={newQuestions[0] || ''}
          />
          <LabeledTextArea
            title="Open Question 2"
            placeholder="Does alpha-synuclein represent a pathologically relevant stimulator of microglial activation?"
            maxLength={200}
            onChange={(newValue) =>
              setNewQuestions(Object.assign([], newQuestions, { 1: newValue }))
            }
            value={newQuestions[1] || ''}
          />
          <LabeledTextArea
            title="Open Question 3"
            placeholder="Example: To what extent do pre-formed fibrils (PFFs) of alpha-synuclein alter neuronal (synaptic) activity prior to neuronal loss?"
            maxLength={200}
            onChange={(newValue) =>
              setNewQuestions(Object.assign([], newQuestions, { 2: newValue }))
            }
            value={newQuestions[2] || ''}
          />
          <LabeledTextArea
            title="Open Question 4"
            placeholder="Example: Is it possible that LRRK2 alters the expression of multiple different miRNAs in different systems?"
            maxLength={200}
            onChange={(newValue) =>
              setNewQuestions(Object.assign([], newQuestions, { 3: newValue }))
            }
            value={newQuestions[3] || ''}
          />
        </div>
      </form>
    </Modal>
  );
};

export default OpenQuestionsModal;
