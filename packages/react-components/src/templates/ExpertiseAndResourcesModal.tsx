import { useState } from 'react';
import { UserPatchRequest, UserResponse } from '@asap-hub/model';
import { css } from '@emotion/react';

import { LabeledMultiSelect, LabeledTextArea } from '../molecules';
import { noop } from '../utils';
import { Link, Paragraph } from '../atoms';
import { EditModal } from '../organisms';
import { mailToSupport } from '../mail';
import { perRem } from '../pixels';

type ExpertiseAndResourcesModalProps = Pick<
  UserResponse,
  'expertiseAndResourceDescription' | 'expertiseAndResourceTags'
> & {
  onSave?: (data: UserPatchRequest) => void | Promise<void>;
  backHref: string;
  expertiseAndResourceSuggestions: string[];
};
const fieldsContainerStyles = css({
  display: 'grid',
  rowGap: `${24 / perRem}em`,
});

const MINIMUM_EXPERTISE_AND_RESOURCES = 5;
const validateExpertiseAndResources = (expertiseAndResourceTags: string[]) =>
  expertiseAndResourceTags.length >= MINIMUM_EXPERTISE_AND_RESOURCES;

const ExpertiseAndResourcesModal: React.FC<ExpertiseAndResourcesModalProps> = ({
  onSave = noop,
  backHref,
  expertiseAndResourceDescription = '',
  expertiseAndResourceTags,
  expertiseAndResourceSuggestions,
}) => {
  const [
    newExpertiseAndResourceDescription,
    setExpertiseAndResourceDescription,
  ] = useState(expertiseAndResourceDescription);
  const [newExpertiseAndResourceTags, setNewExpertiseAndResourceTags] =
    useState(expertiseAndResourceTags);
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
        expertiseAndResourceTags !== newExpertiseAndResourceTags
      }
      validate={() =>
        validateExpertiseAndResources(newExpertiseAndResourceTags)
      }
      onSave={() =>
        onSave({
          expertiseAndResourceDescription:
            newExpertiseAndResourceDescription || undefined,
          expertiseAndResourceTags: newExpertiseAndResourceTags,
        })
      }
    >
      {({ isSaving }) => (
        <>
          <Paragraph accent="lead">
            Help ASAP researchers find you in search results by describing your
            unique expertiseAndResourceTags, techniques, resources, and tools.
          </Paragraph>
          <div css={fieldsContainerStyles}>
            <div>
              <LabeledMultiSelect
                title="Tags"
                subtitle="(Required)"
                description="Select 5 to 10 keywords that best apply to your work."
                placeholder="Start typing…"
                values={newExpertiseAndResourceTags.map((tag) => ({
                  label: tag,
                  value: tag,
                }))}
                enabled={!isSaving}
                onChange={(newValues) => {
                  setNewExpertiseAndResourceTags(
                    newValues.map(({ value }) => value),
                  );
                  validateExpertiseAndResources(
                    newValues.map(({ value }) => value),
                  )
                    ? setExpertiseAndResourcesCustomValidationMessage('')
                    : setExpertiseAndResourcesCustomValidationMessage(
                        `Please add a minimum of ${MINIMUM_EXPERTISE_AND_RESOURCES} tags`,
                      );
                }}
                suggestions={expertiseAndResourceSuggestions}
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
