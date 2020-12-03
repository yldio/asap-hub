import React, { useRef, useState } from 'react';

import { LabeledTextField, ModalEditHeader, Modal } from '../molecules';
import { noop } from '../utils';
import { charcoal } from '../colors';

interface ContactInfoModalProps {
  readonly email?: string;

  readonly fallbackEmail: string;

  readonly backHref: string;
  readonly onSave?: (newEmail: string) => void | Promise<void>;
}
const ContactInfoModal: React.FC<ContactInfoModalProps> = ({
  email = '',
  fallbackEmail,
  backHref,
  onSave = noop,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSaving, setSaving] = useState(false);

  const [newEmail, setNewEmail] = useState(email);

  return (
    <Modal>
      <form ref={formRef}>
        <ModalEditHeader
          backHref={backHref}
          title="Your contact details"
          saveEnabled={!isSaving}
          onSave={async () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (formRef.current!.reportValidity()) {
              setSaving(true);
              await onSave(newEmail);
              if (formRef.current) setSaving(false);
            }
          }}
        />
        <LabeledTextField
          type="email"
          value={newEmail}
          onChange={setNewEmail}
          enabled={!isSaving}
          title="Contact email"
          subtitle={
            <>
              People in the ASAP Network will contact you using{' '}
              <strong css={{ color: charcoal.rgb }}>{fallbackEmail}</strong>. To
              use a different correspondence email address, please add it below.
            </>
          }
          hint="Note: This will not change your login email."
        />
      </form>
    </Modal>
  );
};

export default ContactInfoModal;
