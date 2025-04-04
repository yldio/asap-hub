import { DiscussionCreateRequest } from '@asap-hub/model';
import { css } from '@emotion/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button, Headline3 } from '../atoms';
import { LabeledTextEditor, LabeledTextField, Modal } from '../molecules';
import { mobileScreen, rem } from '../pixels';

const headerStyles = css({
  padding: `${rem(32)} ${rem(24)} 0px ${rem(24)}`,
  marginBottom: rem(12),
  display: 'flex',
});

const buttonMediaQuery = `@media (min-width: ${mobileScreen.max - 100}px)`;

const buttonContainerStyles = css({
  display: 'grid',
  columnGap: rem(24),
  gridTemplateRows: 'max-content 12px max-content',
  [buttonMediaQuery]: {
    gridTemplateColumns: 'max-content max-content',
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

const buttonOverrideStyles = css({
  padding: `${rem(15)} ${rem(33)}}`,
});

const footerStyles = css({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: rem(15),
  gap: rem(24),
});

type DiscussionModalProps = {
  type: 'start' | 'reply';
  onDismiss: () => void;
  onSave: (data: DiscussionCreateRequest) => Promise<void>;
};

type DiscussionModalData = {
  title?: string;
  text: string;
};

const DiscussionModal: React.FC<DiscussionModalProps> = ({
  type,
  onDismiss,
  onSave,
}) => {
  const methods = useForm<DiscussionModalData>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      text: '',
    },
  });
  const [isCancelling, setIsCancelling] = useState(false);

  const modalTitle = type === 'start' ? 'Start Discussion' : 'Reply';

  const {
    control,
    formState: { isSubmitting, isValid },
    handleSubmit,
  } = methods;

  const onSubmit = async (data: DiscussionModalData) => {
    await onSave(data as DiscussionCreateRequest);
    onDismiss();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Modal padding={false}>
        <header css={headerStyles}>
          <Headline3 noMargin>{modalTitle}</Headline3>
        </header>
        <div
          css={{
            padding: `0px ${rem(24)} ${rem(32)} ${rem(24)}`,
          }}
        >
          {type === 'start' && (
            <Controller
              name="title"
              control={control}
              rules={{
                required: true,
                maxLength: {
                  value: 100,
                  message: 'Title cannot exceed 100 characters.',
                },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <LabeledTextField
                  overrideStyles={css({
                    paddingBottom: rem(20),
                  })}
                  title="Title"
                  subtitle="(required)"
                  onChange={onChange}
                  customValidationMessage={error?.message}
                  required
                  value={value || ''}
                  enabled={!(isSubmitting || isCancelling)}
                />
              )}
            />
          )}

          <Controller
            name="text"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <LabeledTextEditor
                title="Please write your message below."
                subtitle="(required)"
                onChange={onChange}
                customValidationMessage={error?.message}
                required
                value={value || ''}
                enabled={!(isSubmitting || isCancelling)}
              />
            )}
          />

          <div css={footerStyles}>
            {isCancelling && (
              <div css={{ fontWeight: 'bold' }}>
                Cancelling now will result in the loss of all entered data. Do
                you want to continue?
              </div>
            )}
            <div css={buttonContainerStyles}>
              <div css={dismissButtonStyles}>
                <Button
                  noMargin
                  enabled
                  overrideStyles={buttonOverrideStyles}
                  onClick={() => setIsCancelling(!isCancelling)}
                >
                  {isCancelling ? 'Keep Editing' : 'Cancel'}
                </Button>
              </div>
              <div css={confirmButtonStyles}>
                {isCancelling ? (
                  <Button
                    warning
                    noMargin
                    overrideStyles={buttonOverrideStyles}
                    enabled
                    onClick={onDismiss}
                  >
                    {type === 'start' ? 'Cancel Discussion' : 'Cancel Reply'}
                  </Button>
                ) : (
                  <Button
                    noMargin
                    primary
                    enabled={!isSubmitting && isValid}
                    overrideStyles={buttonOverrideStyles}
                    submit
                    preventDefault={false}
                    data-testid="discussion-modal-submit"
                  >
                    Send
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </form>
  );
};

export default DiscussionModal;
