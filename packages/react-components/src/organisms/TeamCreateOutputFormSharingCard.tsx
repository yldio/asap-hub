import { USER_SOCIAL_WEBSITE } from '@asap-hub/validation';
import {
  DecisionOption,
  ResearchOutputPostRequest,
  ResearchOutputSharingStatus,
  ResearchOutputSubtype,
  researchOutputDocumentTypeToSubtype,
} from '@asap-hub/model';

import { globeIcon } from '../icons';
import {
  LabeledTextArea,
  LabeledTextField,
  FormCard,
  LabeledDropdown,
  LabeledRadioButtonGroup,
  LabeledDateField,
} from '../molecules';
import { noop } from '../utils';

type TeamCreateOutputFormSharingCardProps = Pick<
  ResearchOutputPostRequest,
  | 'link'
  | 'title'
  | 'description'
  | 'subTypes'
  | 'documentType'
  | 'sharingStatus'
> & {
  onChangeLink?: (newValue: string) => void;
  onChangeTitle?: (newValue: string) => void;
  onChangeDescription?: (newValue: string) => void;
  onChangeSubtypes?: (newValue: ResearchOutputSubtype[]) => void;
  onChangeAsapFunded?: (newValue: DecisionOption) => void;
  onChangeUsedInPublication?: (newValue: DecisionOption) => void;
  onChangeSharingStatus?: (newValue: ResearchOutputSharingStatus) => void;
  onChangePublishDate?: (newValue: Date) => void;
  isSaving: boolean;
  asapFunded: DecisionOption;
  usedInPublication: DecisionOption;
  publishDate?: Date;
};

const TeamCreateOutputFormSharingCard: React.FC<TeamCreateOutputFormSharingCardProps> =
  ({
    isSaving,
    link,
    title,
    description,
    documentType,
    subTypes,
    asapFunded,
    usedInPublication,
    sharingStatus,
    publishDate,
    onChangeDescription = noop,
    onChangeLink = noop,
    onChangeTitle = noop,
    onChangeSubtypes = noop,
    onChangeAsapFunded = noop,
    onChangeUsedInPublication = noop,
    onChangeSharingStatus = noop,
    onChangePublishDate = noop,
  }) => {
    const urlRequired = documentType !== 'Lab Resource';
    const urlSubtitle = urlRequired ? '(required)' : '(optional)';
    return (
      <FormCard title="What are you sharing?">
        <LabeledTextField
          title="URL"
          subtitle={urlSubtitle}
          pattern={USER_SOCIAL_WEBSITE.source}
          onChange={onChangeLink}
          getValidationMessage={() =>
            'Please enter a valid URL, starting with http://'
          }
          value={link ?? ''}
          enabled={!isSaving}
          required={urlRequired}
          labelIndicator={globeIcon}
          placeholder="https://example.com"
        />
        <LabeledDropdown<ResearchOutputSubtype>
          title="Type"
          subtitle="(required)"
          description={`Select the option that applies to this ${documentType.toLowerCase()}.`}
          options={[
            ...researchOutputDocumentTypeToSubtype[documentType].values(),
          ].map((option) => ({
            value: option,
            label: option,
          }))}
          onChange={(subType) => onChangeSubtypes([subType])}
          getValidationMessage={() => 'Please choose a type'}
          value={subTypes[0] ?? ''}
          enabled={!isSaving}
          required
          noOptionsMessage={(option) =>
            `Sorry, no types match ${option.inputValue}`
          }
          placeholder="Choose a type"
        />
        <LabeledTextField
          title="Title"
          maxLength={350}
          subtitle="(required)"
          onChange={onChangeTitle}
          getValidationMessage={() => 'Please enter a title'}
          value={title}
          required
          enabled={!isSaving}
        />
        <LabeledTextArea
          title="Description"
          subtitle="(required)"
          onChange={onChangeDescription}
          getValidationMessage={() => 'Please enter a description'}
          required
          enabled={!isSaving}
          value={description}
        />
        <LabeledRadioButtonGroup
          title="Has this output been funded by ASAP"
          subtitle="(required)"
          options={[
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' },
            { value: 'Not Sure', label: 'Not Sure' },
          ]}
          value={asapFunded}
          onChange={onChangeAsapFunded}
        />

        <LabeledRadioButtonGroup
          title="Has this output been used in a publication"
          subtitle="(required)"
          options={[
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' },
            { value: 'Not Sure', label: 'Not Sure' },
          ]}
          value={usedInPublication}
          onChange={onChangeUsedInPublication}
        />
        <LabeledRadioButtonGroup
          title="Sharing status"
          subtitle="(required)"
          options={[
            { value: 'Network Only', label: 'CRN Only' },
            { value: 'Public', label: 'Public' },
          ]}
          value={sharingStatus}
          onChange={onChangeSharingStatus}
        />
        {sharingStatus === 'Public' ? (
          <LabeledDateField
            title={'Date Published'}
            subtitle={'(optional)'}
            description={
              'This should be the date your output was shared publicly on it’s repository.'
            }
            onChange={onChangePublishDate}
            value={publishDate}
            max={new Date()}
            getValidationMessage={() =>
              'Publish date cannot be greater than today'
            }
          />
        ) : null}
      </FormCard>
    );
  };

export default TeamCreateOutputFormSharingCard;
