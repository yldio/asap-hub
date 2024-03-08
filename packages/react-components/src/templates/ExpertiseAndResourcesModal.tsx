import { useState } from 'react';
import {
  ResearchTagDataObject,
  UserPatchRequest,
  UserResponse,
} from '@asap-hub/model';
import { css } from '@emotion/react';

import { LabeledMultiSelect, LabeledTextArea } from '../molecules';
import { noop } from '../utils';
import { Link } from '../atoms';
import { EditUserModal } from '../organisms';
import { mailToSupport } from '../mail';
import { perRem } from '../pixels';

type ExpertiseAndResourcesModalProps = Pick<
  UserResponse,
  'tags' | 'expertiseAndResourceDescription'
> & {
  onSave?: (data: UserPatchRequest) => void | Promise<void>;
  backHref: string;
  suggestions: ResearchTagDataObject[];
};
const fieldsContainerStyles = css({
  display: 'grid',
  rowGap: `${14 / perRem}em`,
});

const MINIMUM_EXPERTISE_AND_RESOURCES = 5;
const validateExpertiseAndResources = (tags: ResearchTagDataObject[]) =>
  tags.length >= MINIMUM_EXPERTISE_AND_RESOURCES;

const ExpertiseAndResourcesModal: React.FC<ExpertiseAndResourcesModalProps> = ({
  onSave = noop,
  backHref,
  expertiseAndResourceDescription = '',
  tags = [],
  suggestions,
}) => {
  const [
    newExpertiseAndResourceDescription,
    setExpertiseAndResourceDescription,
  ] = useState(expertiseAndResourceDescription);

  const [newTags, setNewTags] = useState(tags);

  const [
    expertiseAndResourcesCustomValidationMessage,
    setExpertiseAndResourcesCustomValidationMessage,
  ] = useState('');

  return (
    <EditUserModal
      title="Expertise, Resources and Tags"
      description="Help ASAP researchers find you in search results by describing your
      unique expertise, techniques, resources, and tools."
      backHref={backHref}
      dirty={
        expertiseAndResourceDescription !==
          newExpertiseAndResourceDescription || tags !== newTags
      }
      validate={() => validateExpertiseAndResources(newTags)}
      onSave={() =>
        onSave({
          expertiseAndResourceDescription:
            newExpertiseAndResourceDescription || undefined,
          tagIds: newTags.map(({ id }) => id),
        })
      }
    >
      {({ isSaving }) => (
        <>
          <div css={fieldsContainerStyles}>
            <LabeledTextArea
              title="Expertise and Resources"
              subtitle="(optional)"
              tip="Summarize your expertise and resources in one to two sentences"
              placeholder="Example: Randy has years of experience in membrane assembly, vesicular transport, and membrane fusion among organelles of the secretory pathway."
              maxLength={200}
              enabled={!isSaving}
              onChange={(newValue) =>
                setExpertiseAndResourceDescription(newValue)
              }
              value={newExpertiseAndResourceDescription}
            />
            <div>
              <LabeledMultiSelect
                title="Tags"
                subtitle="(required)"
                description="Select 5 to 10 keywords that best apply to your work."
                placeholder="Start typing… (E.g. Cell Biology)"
                values={newTags.map((tag) => ({
                  label: tag.name,
                  value: tag.id,
                }))}
                enabled={!isSaving}
                onChange={(newValues) => {
                  setNewTags(
                    newValues.map(({ value, label }) => ({
                      name: label,
                      id: value,
                    })),
                  );
                  validateExpertiseAndResources(
                    newValues.map(({ value, label }) => ({
                      name: label,
                      id: value,
                    })),
                  )
                    ? setExpertiseAndResourcesCustomValidationMessage('')
                    : setExpertiseAndResourcesCustomValidationMessage(
                        `Please add a minimum of ${MINIMUM_EXPERTISE_AND_RESOURCES} tags`,
                      );
                }}
                suggestions={suggestions.map((suggestion) => ({
                  label: suggestion.name,
                  value: suggestion.id,
                }))}
                noOptionsMessage={({ inputValue }) =>
                  `Sorry, No current tags match "${inputValue}"`
                }
                customValidationMessage={
                  expertiseAndResourcesCustomValidationMessage
                }
              />
              <Link href={mailToSupport({ subject: 'New tag' })}>
                Ask ASAP to add a new tag
              </Link>
            </div>
          </div>
        </>
      )}
    </EditUserModal>
  );
};

export default ExpertiseAndResourcesModal;
