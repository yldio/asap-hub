/** @jsxImportSource @emotion/react */
import { ComponentProps, ReactNode, useEffect, useRef, useState } from 'react';
import { Prompt } from 'react-router-dom';
import { FormSection, Modal, ModalEditHeaderDecorator } from '../molecules';
import { rem } from '../pixels';
import { usePushFromHere } from '../routing';
import Toast from './Toast';
import { css } from '@emotion/react';

const contentStyles = css({
  padding: `${rem(32)} ${rem(24)}`,
});

// Todo: Refactor to use <Form> component.

type EditModalProps = Pick<
  ComponentProps<typeof ModalEditHeaderDecorator>,
  'backHref' | 'onSave'
> & {
  title: string;
  validate?: () => boolean;
  dirty: boolean; // mandatory so that it cannot be forgotten
  children: (
    state: { isSaving: boolean },
    asyncFunctionWrapper: (cb: () => void | Promise<void>) => void,
  ) => ReactNode;
  description?: string | ReactNode;
  showHeadingSave?: boolean;
};
const EditModal: React.FC<EditModalProps> = ({
  dirty,
  children,
  title,
  backHref,
  validate = () => true,
  onSave,
  showHeadingSave = false,
  description,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const historyPush = usePushFromHere();
  const [status, setStatus] = useState<
    'initial' | 'isSaving' | 'hasError' | 'hasSaved'
  >('initial');

  useEffect(() => {
    if (status === 'hasSaved') {
      setStatus('initial');
      historyPush(backHref);
    }
  }, [status, backHref, historyPush]);

  const asyncFunctionWrapper = async (cb: () => void | Promise<void>) => {
    const parentValidation = validate();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (formRef.current!.reportValidity() && parentValidation) {
      setStatus('isSaving');
      try {
        await cb();
        if (formRef.current) {
          setStatus('hasSaved');
        }
      } catch {
        if (!formRef.current) return;
        setStatus('hasError');
      }
    }
  };

  const prompt =
    status === 'isSaving' ||
    status === 'hasError' ||
    (status === 'initial' && dirty);

  return (
    <Modal padding={false}>
      <Prompt
        when={prompt}
        message="Are you sure you want to leave the dialog? Unsaved changes will be lost."
      />
      {status === 'hasError' && (
        <Toast>
          There was an error and we were unable to save your changes
        </Toast>
      )}
      <form ref={formRef} css={contentStyles}>
        <FormSection
          title={title}
          description={description}
          headerDecorator={
            <ModalEditHeaderDecorator
              saveEnabled={status !== 'isSaving'}
              onSave={
                showHeadingSave && onSave
                  ? () => asyncFunctionWrapper(onSave)
                  : undefined
              }
              backHref={backHref}
            />
          }
        >
          {children({ isSaving: status === 'isSaving' }, asyncFunctionWrapper)}
        </FormSection>
      </form>
    </Modal>
  );
};
export default EditModal;
