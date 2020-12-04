import React, { ComponentProps, ReactNode, useRef, useState } from 'react';

import { ModalEditHeader, Modal } from '../molecules';
import { noop } from '../utils';
import Toast from './Toast';
import { paddingStyles } from '../card';

type EditModalProps = Pick<
  ComponentProps<typeof ModalEditHeader>,
  'title' | 'backHref' | 'onSave'
> & {
  children: (state: { isSaving: boolean }) => ReactNode;
};
const EditModal: React.FC<EditModalProps> = ({
  children,
  title,
  backHref,
  onSave = noop,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSaving, setSaving] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <Modal padding={false}>
      {hasError && (
        <Toast>
          There was an error and we were unable to save your changes
        </Toast>
      )}
      <form ref={formRef} css={paddingStyles}>
        <ModalEditHeader
          title={title}
          backHref={backHref}
          saveEnabled={!isSaving}
          onSave={async () => {
            setHasError(false);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (formRef.current!.reportValidity()) {
              setSaving(true);
              try {
                await onSave();
              } catch {
                if (formRef.current) setHasError(true);
              } finally {
                if (formRef.current) setSaving(false);
              }
            }
          }}
        />
        {children({ isSaving })}
      </form>
    </Modal>
  );
};
export default EditModal;
