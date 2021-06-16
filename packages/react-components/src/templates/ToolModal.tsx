import { useState } from 'react';
import { TeamTool } from '@asap-hub/model';
import { css } from '@emotion/react';

import { LabeledTextField } from '../molecules';
import { noop } from '../utils';
import { perRem } from '../pixels';
import { EditModal } from '../organisms';

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
  const [newUrl, setNewUrl] = useState(url);
  const [newDescription, setNewDescription] = useState(description);
  const [newName, setNewName] = useState(name);

  return (
    <EditModal
      title={title}
      dirty={
        newUrl !== url || newDescription !== description || newName !== name
      }
      backHref={backHref}
      onSave={() =>
        onSave({
          name: newName,
          url: newUrl,
          description: newDescription,
        })
      }
    >
      {({ isSaving }) => (
        <div css={fieldsContainer}>
          <LabeledTextField
            title="Add URL*"
            subtitle="Ensure sharing settings have been adjusted so that your team can access
        this link."
            value={newUrl}
            onChange={setNewUrl}
            enabled={!isSaving}
            required
          />
          <LabeledTextField
            title="Tool Name*"
            value={newName}
            onChange={setNewName}
            enabled={!isSaving}
            required
          />

          <LabeledTextField
            title="Description (optional)"
            subtitle="Help your team understand what this link is used for."
            value={newDescription}
            onChange={setNewDescription}
            enabled={!isSaving}
          />
        </div>
      )}
    </EditModal>
  );
};

export default ToolModal;
