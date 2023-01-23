import { gp2 } from '@asap-hub/model';
import { LabeledTextArea } from '@asap-hub/react-components';
import { ComponentProps, useState } from 'react';
import EditUserModal from './EditUserModal';

type BiographyModalProps = Pick<gp2.UserResponse, 'biography'> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    onSave: (userData: gp2.UserPatchRequest) => Promise<void>;
  };

const BiographyModal: React.FC<BiographyModalProps> = ({
  onSave,
  backHref,
  biography = '',
}) => {
  const [newBiography, setNewBiography] = useState(biography);

  const checkDirty = () => newBiography !== (biography || '');

  return (
    <EditUserModal
      title="Biography"
      description="Summarize your background and highlight any past achievements to give members of the platform a better understanding of who you are."
      onSave={() =>
        onSave({
          biography: newBiography,
        })
      }
      backHref={backHref}
      dirty={checkDirty()}
    >
      {({ isSaving }) => (
        <LabeledTextArea
          value={newBiography}
          onChange={setNewBiography}
          enabled={!isSaving}
          required
          maxLength={2500}
          title="Background"
          subtitle="(Required)"
          placeholder="Example: Randy is a Professor in the Department of Molecule and Celluar Biology at the University of California and an Investigator of the Howard Hughes Medical Institute. He studied.."
          getValidationMessage={() => 'Please add your biography'}
        />
      )}
    </EditUserModal>
  );
};

export default BiographyModal;
