import { useState } from 'react';
import { UserPatchRequest, UserResponse } from '@asap-hub/model';

import { LabeledMultiSelect, LabeledTextArea } from '../molecules';
import { noop } from '../utils';
import { Link, Paragraph } from '../atoms';
import { EditModal } from '../organisms';
import { mailToSupport } from '../mail';

type SkillsModalProps = Pick<UserResponse, 'skillsDescription' | 'skills'> & {
  onSave?: (data: UserPatchRequest) => void | Promise<void>;
  backHref: string;
  skillSuggestions: string[];
};

const MIN_SKILLS = 5;
const validateSkills = (skills: string[]) => skills.length >= MIN_SKILLS;

const SkillsModal: React.FC<SkillsModalProps> = ({
  onSave = noop,
  backHref,
  skillsDescription = '',
  skills,
  skillSuggestions,
}) => {
  const [newSkillsDescription, setSkillsDescription] =
    useState(skillsDescription);
  const [newSkills, setNewSkills] = useState(skills);
  const [skillsCustomValidationMessage, setSkillsCustomValidationMessage] =
    useState('');

  return (
    <EditModal
      title="Expertise and resources"
      backHref={backHref}
      dirty={skillsDescription !== newSkillsDescription || skills !== newSkills}
      validate={() => {
        const skillsValid = validateSkills(newSkills);
        !skillsValid &&
          setSkillsCustomValidationMessage(
            `Please add a minimum of ${MIN_SKILLS} tags`,
          );
        return skillsValid;
      }}
      onSave={() =>
        onSave({
          skillsDescription: newSkillsDescription || undefined,
          skills: newSkills,
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
          <LabeledMultiSelect
            title="Skills"
            subtitle="Select the keywords that best apply to your work. Please add a minimum of 5 tags."
            placeholder="Add a tag (E.g. Cell Biology)"
            values={newSkills}
            enabled={!isSaving}
            onChange={(newValue) => {
              setNewSkills(newValue);
              if (validateSkills(newValue))
                setSkillsCustomValidationMessage('');
            }}
            suggestions={skillSuggestions}
            noOptionsMessage={({ inputValue }) =>
              `Sorry, No current tags match "${inputValue}"`
            }
            customValidationMessage={skillsCustomValidationMessage}
          />
          <Link href={mailToSupport({ subject: 'New tag' })}>
            Ask ASAP to add a new tag
          </Link>
        </>
      )}
    </EditModal>
  );
};

export default SkillsModal;
