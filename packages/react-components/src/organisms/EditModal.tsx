/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ComponentProps, ReactNode, useEffect, useRef, useState } from 'react';
import { Prompt } from 'react-router-dom';

import { paddingStyles } from '../card';
import { Modal, ModalEditHeader } from '../molecules';
import { perRem } from '../pixels';
import { usePushFromHere } from '../routing';
import { noop } from '../utils';
import Toast from './Toast';

const styles = css({
  boxSizing: 'border-box',
  height: '100%',
  display: 'grid',
  gridTemplateRows: 'max-content 1fr',
  overflow: 'auto',
});
const bodyStyles = css(paddingStyles, {
  paddingTop: `${12 / perRem}em`,

  overflowY: 'auto',
});

// Todo: Refactor to use <Form> component.

type EditModalProps = Pick<
  ComponentProps<typeof ModalEditHeader>,
  'title' | 'backHref' | 'onSave'
> & {
  validate?: () => boolean;
  dirty: boolean; // mandatory so that it cannot be forgotten
  children: (
    state: { isSaving: boolean },
    asyncFunctionWrapper: (cb: () => void | Promise<void>) => void,
  ) => ReactNode;
  noHeader?: boolean;
};
const EditModal: React.FC<EditModalProps> = ({
  dirty,
  children,
  title,
  backHref,
  validate = () => true,
  onSave = noop,
  noHeader = false,
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
      <form
        ref={formRef}
        css={({ components }) => [styles, components?.EditModal?.styles]}
      >
        {!noHeader && (
          <ModalEditHeader
            title={title}
            backHref={backHref}
            saveEnabled={status !== 'isSaving'}
            onSave={() => asyncFunctionWrapper(onSave)}
          />
        )}
        <main
          css={({ components }) => [
            bodyStyles,
            components?.EditModal?.bodyStyles,
          ]}
        >
          {children({ isSaving: status === 'isSaving' }, asyncFunctionWrapper)}
        </main>
      </form>
    </Modal>
  );
};
export default EditModal;
