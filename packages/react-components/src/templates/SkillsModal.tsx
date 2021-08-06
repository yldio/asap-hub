import { useState } from 'react';
import { UserPatchRequest, UserResponse } from '@asap-hub/model';
import { css } from '@emotion/react';

import { LabeledMultiSelect, LabeledTextArea } from '../molecules';
import { noop } from '../utils';
import { Link, Paragraph } from '../atoms';
import { EditModal } from '../organisms';
import { mailToSupport } from '../mail';
import { perRem } from '../pixels';

type SkillsModalProps = Pick<UserResponse, 'skillsDescription' | 'skills'> & {
  onSave?: (data: UserPatchRequest) => void | Promise<void>;
  backHref: string;
  skillSuggestions: string[];
};
const fieldsContainerStyles = css({
  display: 'grid',
  rowGap: `${24 / perRem}em`,
});

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
      validate={() => validateSkills(newSkills)}
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
          <div css={fieldsContainerStyles}>
            <div>
              <LabeledMultiSelect
                title="Tags*"
                subtitle="Select 5 to 10 keywords that best apply to your work."
                placeholder="Start typing…"
                values={newSkills}
                enabled={!isSaving}
                onChange={(newValue) => {
                  setNewSkills(newValue);
                  validateSkills(newValue)
                    ? setSkillsCustomValidationMessage('')
                    : setSkillsCustomValidationMessage(
                        `Please add a minimum of ${MIN_SKILLS} tags`,
                      );
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
            </div>
            <LabeledTextArea
              title="Overview"
              tip="Summarize your expertise and resources in one to two sentences"
              placeholder="Example: Randy has years of experience in membrane assembly, vesicular transport, and membrane fusion among organelles of the secretory pathway."
              maxLength={200}
              enabled={!isSaving}
              onChange={(newValue) => setSkillsDescription(newValue)}
              value={newSkillsDescription}
            />
          </div>
        </>
      )}
    </EditModal>
  );
};

export default SkillsModal;
