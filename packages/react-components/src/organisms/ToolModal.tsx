import React, { useState, useRef } from 'react';
import { TeamTool } from '@asap-hub/model';
import css from '@emotion/css';

import ModalEditHeader from '../molecules/ModalEditHeader';
import { Modal, LabeledTextField } from '../molecules';
import { noop } from '../utils';
import { perRem } from '../pixels';

const formContainer = css({
  display: 'grid',
  rowGap: `${12 / perRem}em`,
  gridTemplateColumns: '100%',
});

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
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Modal>
      <form ref={formRef}>
        <ModalEditHeader
          backHref={backHref}
          onSave={() => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (formRef.current!.reportValidity()) {
              onSave({
                name: newName,
                url: newUrl,
                description: newDescription,
              });
            }
          }}
          title={title}
        />
        <div css={formContainer}>
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
        </div>
      </form>
    </Modal>
  );
};

export default ToolModal;
