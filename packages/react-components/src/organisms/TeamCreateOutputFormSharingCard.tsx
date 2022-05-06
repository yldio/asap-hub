import {
  DecisionOption,
  researchOutputDocumentTypeToType,
  ResearchOutputPostRequest,
  ResearchOutputSharingStatus,
  ResearchOutputType,
  ValidationErrorResponse,
} from '@asap-hub/model';
import { UrlExpression } from '@asap-hub/validation';
import { useEffect, useState } from 'react';
import { getAjvErrorForPath } from '../ajv-errors';
import { globeIcon } from '../icons';
import {
  FormCard,
  LabeledDateField,
  LabeledDropdown,
  LabeledRadioButtonGroup,
  LabeledTextArea,
  LabeledTextField,
} from '../molecules';
import { noop } from '../utils';

type TeamCreateOutputFormSharingCardProps = Pick<
  ResearchOutputPostRequest,
  'link' | 'title' | 'description' | 'documentType' | 'sharingStatus'
> & {
  type: ResearchOutputType | '';
  onChangeLink?: (newValue: string) => void;
  onChangeTitle?: (newValue: string) => void;
  onChangeDescription?: (newValue: string) => void;
  onChangeType?: (newValue: ResearchOutputType | '') => void;
  onChangeAsapFunded?: (newValue: DecisionOption) => void;
  onChangeUsedInPublication?: (newValue: DecisionOption) => void;
  onChangeSharingStatus?: (newValue: ResearchOutputSharingStatus) => void;
  onChangePublishDate?: (newValue: Date) => void;
  isSaving: boolean;
  asapFunded: DecisionOption;
  usedInPublication: DecisionOption;
  publishDate?: Date;
  serverValidationErrors?: ValidationErrorResponse['data'];
  clearServerValidationError?: (instancePath: string) => void;
};

const TeamCreateOutputFormSharingCard: React.FC<TeamCreateOutputFormSharingCardProps> =
  ({
    isSaving,
    link,
    title,
    description,
    documentType,
    type,
    asapFunded,
    usedInPublication,
    sharingStatus,
    publishDate,
    serverValidationErrors = [],
    clearServerValidationError = noop,
    onChangeDescription = noop,
    onChangeLink = noop,
    onChangeTitle = noop,
    onChangeType = noop,
    onChangeAsapFunded = noop,
    onChangeUsedInPublication = noop,
    onChangeSharingStatus = noop,
    onChangePublishDate = noop,
  }) => {
    const urlRequired = documentType !== 'Lab Resource';
    const urlSubtitle = urlRequired ? '(required)' : '(optional)';
    const [urlValidationMessage, setUrlValidationMessage] = useState<string>();
    const [titleValidationMessage, setTitleValidationMessage] =
      useState<string>();
    useEffect(() => {
      setUrlValidationMessage(
        getAjvErrorForPath(
          serverValidationErrors,
          '/link',
          'A Research Output with this URL already exists. Please enter a different URL.',
        ),
      );
      setTitleValidationMessage(
        getAjvErrorForPath(
          serverValidationErrors,
          '/title',
          'A Research Output with this title already exists. Please check if this is repeated and choose a different title.',
        ),
      );
    }, [serverValidationErrors]);
    return (
      <FormCard title="What are you sharing?">
        <LabeledTextField
          title="URL"
          subtitle={urlSubtitle}
          pattern={UrlExpression}
          onChange={(newValue) => {
            clearServerValidationError('/link');
            onChangeLink(newValue);
          }}
          customValidationMessage={urlValidationMessage}
          getValidationMessage={(validationState) =>
            validationState.valueMissing || validationState.patternMismatch
              ? 'Please enter a valid URL, starting with http://'
              : undefined
          }
          value={link ?? ''}
          enabled={!isSaving}
          required={urlRequired}
          labelIndicator={globeIcon}
          placeholder="https://example.com"
        />
        <LabeledDropdown<ResearchOutputType | ''>
          title="Type"
          subtitle="(required)"
          description={`Select the option that applies to this ${documentType.toLowerCase()}.`}
          options={[
            ...researchOutputDocumentTypeToType[documentType].values(),
          ].map((option) => ({
            value: option,
            label: option,
          }))}
          onChange={(selectedType) => onChangeType(selectedType)}
          getValidationMessage={() => 'Please choose a type'}
          value={type ?? ''}
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
          onChange={(newValue) => {
            clearServerValidationError('/title');
            onChangeTitle(newValue);
          }}
          customValidationMessage={titleValidationMessage}
          getValidationMessage={(validationState) =>
            validationState.valueMissing || validationState.patternMismatch
              ? 'Please enter a title'
              : undefined
          }
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
