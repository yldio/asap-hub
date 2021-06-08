import { useState } from 'react';
import { UserPatchRequest, UserResponse } from '@asap-hub/model';

import { LabeledTextArea } from '../molecules';
import { noop } from '../utils';
import { Paragraph } from '../atoms';
import { EditModal } from '../organisms';

type SkillsModalProps = Pick<UserResponse, 'skillsDescription'> & {
  onSave?: (data: UserPatchRequest) => void | Promise<void>;
  backHref: string;
};

const SkillsModal: React.FC<SkillsModalProps> = ({
  onSave = noop,
  backHref,
  skillsDescription = '',
}) => {
  const [newSkillsDescription, setSkillsDescription] =
    useState(skillsDescription);

  return (
    <EditModal
      title="Expertise and resources"
      backHref={backHref}
      dirty={skillsDescription !== newSkillsDescription}
      onSave={() =>
        onSave({
          skillsDescription: newSkillsDescription || undefined,
        })
      }
    >
      {({ isSaving }) => (
        <>
          <Paragraph accent="lead">
            Help ASAP researchers find you in search results by describing your
            unique skills, techniques, resources, and tools.
          </Paragraph>
          <LabeledTextArea
            title="Overview"
            tip="Summarize your expertise and resources in one to two sentences"
            placeholder="Example: Randy has years of experience in membrane assembly, vesicular transport, and membrane fusion among organelles of the secretory pathway."
            maxLength={200}
            enabled={!isSaving}
            onChange={(newValue) => setSkillsDescription(newValue)}
            value={newSkillsDescription}
          />
        </>
      )}
    </EditModal>
  );
};

export default SkillsModal;
