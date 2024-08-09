import { useState } from 'react';

import { LabeledTextArea } from '../molecules';
import { noop } from '../utils';
import { EditUserModal } from '../organisms';

export interface BiographyModalProps {
  biography?: string;

  onSave?: (newBiography: string) => void | Promise<void>;
  backHref: string;
}
const BiographyModal: React.FC<BiographyModalProps> = ({
  biography = '',

  onSave = noop,
  backHref,
}) => {
  const [newBiography, setNewBiography] = useState(biography);

  return (
    <EditUserModal
      title="Biography"
      dirty={newBiography !== biography}
      backHref={backHref}
      onSave={() => onSave(newBiography)}
    >
      {({ isSaving }) => (
        <LabeledTextArea
          value={newBiography}
          onChange={setNewBiography}
          enabled={!isSaving}
          required
          maxLength={1000}
          title="Biography Details"
          subtitle="(required)"
          tip="Summarize your background and highlight any past achievements. Tip: refer to yourself in the third person."
          placeholder="Example: Randy is a Professor in the Department of Molecular and Cell Biology, University of California, and an Investigator of the Howard Hughes Medical Institute. He studied the enzymology of DNA replication as a graduate student with Arthur Kornberg at Stanford University. Among his awards is the Nobel Prize in Physiology or Medicine, which he shared with James Rothman and Thomas Südhof."
          getValidationMessage={() => 'Please add your biography'}
        />
      )}
    </EditUserModal>
  );
};

export default BiographyModal;
