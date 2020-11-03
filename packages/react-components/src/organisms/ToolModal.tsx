import React, { useState } from 'react';
import { TeamTool } from '@asap-hub/model';

import ModalEditHeader from '../molecules/ModalEditHeader';
import { Modal, LabeledTextField } from '../molecules';
import { noop } from '../utils';

type ToolModalProps = Partial<TeamTool> & {
  onSave?: (data: TeamTool) => void;
  title: string;
  backHref: string;
};

const ToolModal: React.FC<ToolModalProps> = ({
  title,
  url = '',
  description = '',
  name = '',
  onSave = noop,
  backHref,
}) => {
  const [newUrl, setNewUrl] = useState(url);
  const [newDescription, setNewDescription] = useState(description);
  const [newName, setNewName] = useState(name);
  return (
    <Modal>
      <ModalEditHeader
        backHref={backHref}
        onSave={() =>
          onSave({
            name: newName,
            url: newUrl,
            description: newDescription,
          })
        }
        title={title}
      />
      <LabeledTextField
        title="Add URL"
        subtitle="Ensure sharing settings have been adjusted so that your team can access
        this link."
        value={newUrl}
        onChange={setNewUrl}
      />
      <LabeledTextField
        title="Tool Name"
        value={newName}
        onChange={setNewName}
      />

      <LabeledTextField
        title="Description"
        subtitle="Help your team understand what this link is used for."
        value={newDescription}
        onChange={setNewDescription}
      />
    </Modal>
  );
};

export default ToolModal;
