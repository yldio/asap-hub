import { gp2 } from '@asap-hub/model';
import { LabeledTextField } from '@asap-hub/react-components';
import { ComponentProps, useState } from 'react';
import EditUserModal from './EditUserModal';

type KeyInformationModalProps = Pick<
  gp2.UserResponse,
  'firstName' | 'lastName'
> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    onSave: (userData: gp2.UserPatchRequest) => Promise<void>;
  };

const KeyInformationModal: React.FC<KeyInformationModalProps> = ({
  onSave,
  backHref,
  firstName,
  lastName,
}) => {
  const [newFirstName, setNewFirstName] = useState(firstName);
  const [newLastName, setNewLastName] = useState(lastName);
  return (
    <EditUserModal
      title="Key Information"
      description="Tell us a little more about yourself. This will help others to be able to connect with you or credit you in the right way."
      onSave={() => onSave({ firstName: newFirstName, lastName: newLastName })}
      backHref={backHref}
      dirty={newFirstName !== firstName || newLastName !== lastName}
    >
      {({ isSaving }) => (
        <>
          <LabeledTextField
            title="First Name"
            subtitle="(Required)"
            required
            enabled={!isSaving}
            value={newFirstName}
            onChange={setNewFirstName}
          />
          <LabeledTextField
            title="Last Name"
            subtitle="(Required)"
            required
            enabled={!isSaving}
            value={newLastName}
            onChange={setNewLastName}
          />
        </>
      )}
    </EditUserModal>
  );
};

export default KeyInformationModal;
