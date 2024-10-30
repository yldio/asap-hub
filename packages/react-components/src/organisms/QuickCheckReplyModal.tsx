import { DiscussionPatchRequest } from '@asap-hub/model';
import { css } from '@emotion/react';
import { Controller, useForm } from 'react-hook-form';

import { Button, Headline3 } from '../atoms';
import { paddingStyles } from '../card';
import { crossIcon } from '../icons';
import { LabeledTextArea, Modal } from '../molecules';
import { mobileScreen, perRem } from '../pixels';

const headerStyles = css(paddingStyles, {
  paddingBottom: 0,
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'space-between',
});

const controlsContainerStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
});

const buttonMediaQuery = `@media (min-width: ${mobileScreen.max - 100}px)`;

const buttonContainerStyles = css({
  display: 'grid',
  columnGap: `${30 / perRem}em`,
  gridTemplateRows: 'max-content 12px max-content',
  [buttonMediaQuery]: {
    gridTemplateColumns: 'max-content max-content',
    gridTemplateRows: 'auto',
    justifyContent: 'flex-end',
  },
});

const confirmButtonStyles = css({
  display: 'flex',
  justifyContent: 'center',
  gridRow: '1 / span 2',
  gridColumn: '1',
  [buttonMediaQuery]: {
    gridRow: '1',
    gridColumn: '2',
  },
});
const dismissButtonStyles = css({
  display: 'flex',
  justifyContent: 'center',
  gridRow: '2 / span 2',
  gridColumn: '1',
  [buttonMediaQuery]: {
    gridRow: '1',
  },
});
export const asapFunded = ['Yes', 'No'] as const;

export type ASAPFunded = (typeof asapFunded)[number];

type QuickCheckReplyModalProps = {
  onDismiss: () => void;
  discussionId: string;
  onReplyToDiscussion: (
    id: string,
    patch: DiscussionPatchRequest,
  ) => Promise<void>;
};

type QuickCheckReplyModalData = {
  replyText: string;
};
const QuickCheckReplyModal: React.FC<QuickCheckReplyModalProps> = ({
  onDismiss,
  discussionId,
  onReplyToDiscussion,
}) => {
  const methods = useForm<QuickCheckReplyModalData>({
    mode: 'onBlur',
    defaultValues: {
      replyText: '',
    },
  });

  const {
    control,
    formState: { isSubmitting, isValid },
    handleSubmit,
  } = methods;

  const onSubmit = async (data: QuickCheckReplyModalData) => {
    await onReplyToDiscussion(discussionId, data);
    onDismiss();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Modal padding={false}>
        <header css={headerStyles}>
          <div css={controlsContainerStyles}>
            <Button small onClick={onDismiss}>
              {crossIcon}
            </Button>
          </div>
          <Headline3>Reply to quick check</Headline3>
        </header>
        <div css={[paddingStyles, { paddingTop: 0 }]}>
          <Controller
            name="replyText"
            control={control}
            rules={{
              required: 'Please provide details.',
            }}
            render={({
              field: { value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <LabeledTextArea
                title="Please provide details"
                subtitle="(required)"
                customValidationMessage={error?.message}
                value={value || ''}
                onChange={onChange}
                onBlur={onBlur}
                enabled={!isSubmitting}
              />
            )}
          />

          <div css={buttonContainerStyles}>
            <div css={dismissButtonStyles}>
              <Button enabled onClick={onDismiss}>
                Cancel
              </Button>
            </div>
            <div css={confirmButtonStyles}>
              <Button
                primary
                enabled={!isSubmitting && isValid}
                submit
                preventDefault={false}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </form>
  );
};

export default QuickCheckReplyModal;
