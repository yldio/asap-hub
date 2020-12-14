import React, {
  ComponentProps,
  ReactNode,
  useRef,
  useState,
  useEffect,
} from 'react';
import { Prompt } from 'react-router-dom';

import { ModalEditHeader, Modal } from '../molecules';
import { noop } from '../utils';
import Toast from './Toast';
import { paddingStyles } from '../card';
import { usePushFromHere } from '../routing';

type EditModalProps = Pick<
  ComponentProps<typeof ModalEditHeader>,
  'title' | 'backHref' | 'onSave'
> & {
  dirty: boolean; // mandatory so that it cannot be forgotten
  children: (state: { isSaving: boolean }) => ReactNode;
};
const EditModal: React.FC<EditModalProps> = ({
  dirty,
  children,
  title,
  backHref,
  onSave = noop,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<
    'initial' | 'isSaving' | 'hasError' | 'hasSaved'
  >('initial');
  useEffect(() => {
    if (status === 'hasSaved' && !dirty) {
      setStatus('initial');
    }
  }, [status, dirty]);

  const historyPush = usePushFromHere();

  return (
    <Modal padding={false}>
      <Prompt
        when={
          status === 'isSaving' ||
          status === 'hasError' ||
          (status === 'initial' && dirty)
        }
        message="Are you sure you want to leave the dialog? Unsaved changes will be lost."
      />
      {status === 'hasError' && (
        <Toast>
          There was an error and we were unable to save your changes
        </Toast>
      )}
      <form ref={formRef} css={paddingStyles}>
        <ModalEditHeader
          title={title}
          backHref={backHref}
          saveEnabled={status !== 'isSaving'}
          onSave={async () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (formRef.current!.reportValidity()) {
              setStatus('isSaving');
              try {
                await onSave();
                if (!formRef.current) return;
                setStatus('hasSaved');
                historyPush(backHref);
              } catch {
                if (!formRef.current) return;
                setStatus('hasError');
              }
            }
          }}
        />
        {children({ isSaving: status === 'isSaving' })}
      </form>
    </Modal>
  );
};
export default EditModal;
