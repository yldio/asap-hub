import { useState } from 'react';
import { ResearchTagDataObject, UserPatchRequest, UserResponse } from '@asap-hub/model';
import { css } from '@emotion/react';

import { LabeledMultiSelect, LabeledTextArea } from '../molecules';
import { noop } from '../utils';
import { Link, Paragraph } from '../atoms';
import { EditModal } from '../organisms';
import { mailToSupport } from '../mail';
import { perRem } from '../pixels';

type ExpertiseAndResourcesModalProps = Pick<
  UserResponse,
  'tags' | 'expertiseAndResourceDescription'
> & {
  onSave?: (data: UserPatchRequest) => void | Promise<void>;
  backHref: string;
  suggestions: ResearchTagDataObject[],
};
const fieldsContainerStyles = css({
  display: 'grid',
  rowGap: `${24 / perRem}em`,
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

  const [newTags, setNewTags] =
    useState(tags);

  const [
    expertiseAndResourcesCustomValidationMessage,
    setExpertiseAndResourcesCustomValidationMessage,
  ] = useState('');

  return (
    <EditModal
      title="Expertise and resources"
      backHref={backHref}
      dirty={
        expertiseAndResourceDescription !==
          newExpertiseAndResourceDescription ||
        tags !== newTags
      }
      validate={() =>
        validateExpertiseAndResources(newTags)
      }
      onSave={() =>
        onSave({
          expertiseAndResourceDescription:
            newExpertiseAndResourceDescription || undefined,
          tagIds: newTags.map(({id})=>id),
        })
      }
    >
      {({ isSaving }) => (
        <>
          <Paragraph accent="lead">
            Help ASAP researchers find you in search results by describing your
            unique expertise, techniques, resources, and tools.
          </Paragraph>
          <div css={fieldsContainerStyles}>
            <div>
              <LabeledMultiSelect
                title="Tags"
                subtitle="(Required)"
                description="Select 5 to 10 tags that best apply to your work."
                placeholder="Start typing…"
                values={newTags.map((tag) => ({
                  label: tag.name,
                  value: tag.id,
                }))}
                enabled={!isSaving}
                onChange={(newValues) => {
                  setNewTags(
                    newValues.map(({ value, label }) => ({name: label, id: value})),
                  );
                  validateExpertiseAndResources(
                    newValues.map(({ value, label }) => ({name: label, id: value})),
                  )
                    ? setExpertiseAndResourcesCustomValidationMessage('')
                    : setExpertiseAndResourcesCustomValidationMessage(
                        `Please add a minimum of ${MINIMUM_EXPERTISE_AND_RESOURCES} tags`,
                      );
                }}
                suggestions={suggestions.map(
                  (suggestion) => ({
                    label: suggestion.name,
                    value: suggestion.id,
                  }),
                )}
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
            <LabeledTextArea
              title="Overview"
              subtitle="(Optional)"
              tip="Summarize your expertise and resources in one to two sentences"
              placeholder="Example: Randy has years of experience in membrane assembly, vesicular transport, and membrane fusion among organelles of the secretory pathway."
              maxLength={200}
              enabled={!isSaving}
              onChange={(newValue) =>
                setExpertiseAndResourceDescription(newValue)
              }
              value={newExpertiseAndResourceDescription}
            />
          </div>
        </>
      )}
    </EditModal>
  );
};

export default ExpertiseAndResourcesModal;
