import { DiscussionCreateRequest } from '@asap-hub/model';
import { css } from '@emotion/react';
import { Controller, useForm } from 'react-hook-form';

import { Button, Headline3 } from '../atoms';
import { crossIcon } from '../icons';
import { LabeledTextEditor, LabeledTextField, Modal } from '../molecules';
import { mobileScreen, perRem, rem } from '../pixels';

const headerStyles = css({
  padding: `${rem(32)} ${rem(24)} 0px ${rem(24)}`,
  marginBottom: rem(12),
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
  marginTop: `${14 / perRem}em`,
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
          <div css={controlsContainerStyles}>
            <Button noMargin small onClick={onDismiss}>
              {crossIcon}
            </Button>
          </div>
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
                    paddingBottom: `${20 / perRem}em`,
                  })}
                  title="Title"
                  subtitle="(required)"
                  onChange={onChange}
                  customValidationMessage={error?.message}
                  required
                  value={value || ''}
                  enabled={!isSubmitting}
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
                enabled={!isSubmitting}
              />
            )}
          />

          <div css={buttonContainerStyles}>
            <div css={dismissButtonStyles}>
              <Button noMargin enabled onClick={onDismiss}>
                Cancel
              </Button>
            </div>
            <div css={confirmButtonStyles}>
              <Button
                noMargin
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
