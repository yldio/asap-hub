import React, { useState } from 'react';
import { TeamTool } from '@asap-hub/model';

import { Paragraph, TextField } from '../atoms';
import Subtitle from '../atoms/Subtitle';
import ModalEditHeader from '../molecules/ModalEditHeader';
import { Modal } from '../molecules';
import { noop } from '../utils';

type LinkModalProps = Partial<TeamTool> & {
  onSave?: (data: TeamTool) => void;
  title: string;
  backHref: string;
};

const LinkModal: React.FC<LinkModalProps> = ({
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
      <Subtitle>Add URL</Subtitle>
      <Paragraph accent="lead">
        Ensure sharing settings have been adjusted so that your team can access
        this link.
      </Paragraph>
      <TextField value={newUrl} onChange={setNewUrl} />
      <Subtitle>Tool Name</Subtitle>
      <TextField value={newName} onChange={setNewName} />
      <Subtitle>Description</Subtitle>
      <Paragraph accent="lead">
        Help your team understand what this link is used for.
      </Paragraph>
      <TextField value={newDescription} onChange={setNewDescription} />
    </Modal>
  );
};

export default LinkModal;
