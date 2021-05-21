import { useState } from 'react';

import { LabeledTextField } from '../molecules';
import { noop } from '../utils';
import { charcoal } from '../colors';
import { EditModal } from '../organisms';

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
  const [newEmail, setNewEmail] = useState(email);

  return (
    <EditModal
      backHref={backHref}
      title="Your contact details"
      dirty={newEmail !== email}
      onSave={() => onSave(newEmail)}
    >
      {({ isSaving }) => (
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
          hint="Note: This will not affect the way you login into the Hub."
        />
      )}
    </EditModal>
  );
};

export default ContactInfoModal;
