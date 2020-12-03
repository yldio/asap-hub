import React, { ComponentProps, ReactNode, useRef, useState } from 'react';

import { ModalEditHeader, Modal } from '../molecules';
import { noop } from '../utils';

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

  return (
    <Modal>
      <form ref={formRef}>
        <ModalEditHeader
          title={title}
          backHref={backHref}
          saveEnabled={!isSaving}
          onSave={async () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (formRef.current!.reportValidity()) {
              setSaving(true);
              await onSave();
              if (formRef.current) setSaving(false);
            }
          }}
        />
        {children({ isSaving })}
      </form>
    </Modal>
  );
};
export default EditModal;
