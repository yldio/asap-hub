import { DiscussionRequest } from '@asap-hub/model';
import { css } from '@emotion/react';
import { Controller, useForm } from 'react-hook-form';

import { Button, Headline3 } from '../atoms';
import { paddingStyles } from '../card';
import { crossIcon } from '../icons';
import { LabeledTextEditor, Modal } from '../molecules';
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

type DiscussionModalProps = {
  title: string;
  editorLabel: string;
  ruleMessage: string;
  onDismiss: () => void;
  discussionId: string;
  onSave: (id: string, data: DiscussionRequest) => Promise<void>;
};

type DiscussionModalData = {
  text: string;
};

const DiscussionModal: React.FC<DiscussionModalProps> = ({
  title,
  editorLabel,
  ruleMessage,
  discussionId,
  onDismiss,
  onSave,
}) => {
  const methods = useForm<DiscussionModalData>({
    mode: 'onChange',
    defaultValues: {
      text: '',
    },
  });

  const {
    control,
    formState: { isSubmitting, isValid },
    handleSubmit,
  } = methods;

  const onSubmit = async (data: DiscussionModalData) => {
    await onSave(discussionId, data);
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
          <Headline3>{title}</Headline3>
        </header>
        <div css={[paddingStyles, { paddingTop: 0 }]}>
          <Controller
            name="text"
            control={control}
            rules={{
              required: true,
              maxLength: {
                value: 256,
                message: ruleMessage,
              },
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <LabeledTextEditor
                title={editorLabel}
                subtitle="(required)"
                onChange={onChange}
                customValidationMessage={error?.message}
                required
                maxLength={256}
                value={value || ''}
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
                data-testid="discussion-modal-submit"
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

export default DiscussionModal;
