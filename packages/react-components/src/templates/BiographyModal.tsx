import React, { useRef, useState } from 'react';

import { Modal } from '../organisms';
import { ModalEditHeader, LabeledTextArea } from '../molecules';
import { noop } from '../utils';

interface BiographyModalProps {
  biography?: string;

  onSave?: (newBiography: string) => void | Promise<void>;
  backHref: string;
}
const BiographyModal: React.FC<BiographyModalProps> = ({
  biography = '',

  onSave = noop,
  backHref,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSaving, setSaving] = useState(false);

  const [newBiography, setNewBiography] = useState(biography);

  return (
    <Modal>
      <form ref={formRef}>
        <ModalEditHeader
          title="Biography"
          backHref={backHref}
          saveEnabled={!isSaving}
          onSave={async () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (formRef.current!.reportValidity()) {
              setSaving(true);
              await onSave(newBiography);
              if (formRef.current) setSaving(false);
            }
          }}
        />
        <LabeledTextArea
          value={newBiography}
          onChange={setNewBiography}
          enabled={!isSaving}
          required
          maxLength={1000}
          title="Summarize your background and highlight any past achievements."
          tip="Tip: refer to yourself in the third person."
          placeholder="Example: Randy is a Professor in the Department of Molecular and Cell Biology, University of California, and an Investigator of the Howard Hughes Medical Institute. He studied the enzymology of DNA replication as a graduate student with Arthur Kornberg at Stanford University. Among his awards is the Nobel Prize in Physiology or Medicine, which he shared with James Rothman and Thomas Südhof."
        />
      </form>
    </Modal>
  );
};

export default BiographyModal;
