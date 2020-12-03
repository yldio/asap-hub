import React, { useState, useRef } from 'react';
import { TeamTool } from '@asap-hub/model';
import css from '@emotion/css';

import { ModalEditHeader, LabeledTextField, Modal } from '../molecules';
import { noop } from '../utils';
import { perRem } from '../pixels';

const fieldsContainer = css({
  display: 'grid',
  rowGap: `${12 / perRem}em`,
});

type ToolModalProps = Partial<TeamTool> & {
  onSave?: (data: TeamTool) => Promise<void>;
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
  const formRef = useRef<HTMLFormElement>(null);
  const [isSaving, setSaving] = useState(false);

  const [newUrl, setNewUrl] = useState(url);
  const [newDescription, setNewDescription] = useState(description);
  const [newName, setNewName] = useState(name);

  return (
    <Modal>
      <form ref={formRef}>
        <ModalEditHeader
          backHref={backHref}
          saveEnabled={!isSaving}
          onSave={async () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (formRef.current!.reportValidity()) {
              setSaving(true);
              await onSave({
                name: newName,
                url: newUrl,
                description: newDescription,
              });
              if (formRef.current) setSaving(false);
            }
          }}
          title={title}
        />
        <div css={fieldsContainer}>
          <LabeledTextField
            title="Add URL"
            subtitle="Ensure sharing settings have been adjusted so that your team can access
        this link."
            value={newUrl}
            onChange={setNewUrl}
            enabled={!isSaving}
            required
          />
          <LabeledTextField
            title="Tool Name"
            value={newName}
            onChange={setNewName}
            enabled={!isSaving}
            required
          />

          <LabeledTextField
            title="Description"
            subtitle="Help your team understand what this link is used for."
            value={newDescription}
            onChange={setNewDescription}
            enabled={!isSaving}
            required
          />
        </div>
      </form>
    </Modal>
  );
};

export default ToolModal;
