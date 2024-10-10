import {
  DecisionOption,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  ResearchOutputSharingStatus,
  ResearchOutputType,
  ResearchTagResponse,
  ValidationErrorResponse,
} from '@asap-hub/model';
import { urlExpression } from '@asap-hub/validation';
import { useEffect, useState } from 'react';
import { getAjvErrorForPath } from '../ajv-errors';
import { GlobeIcon } from '../icons';
import {
  FormCard,
  LabeledDateField,
  LabeledDropdown,
  LabeledRadioButtonGroup,
  LabeledTextEditor,
  LabeledTextField,
} from '../molecules';
import { noop } from '../utils';
import { Markdown } from '../atoms/index';
import OutputShortDescriptionCard from './OutputShortDescriptionCard';

type ResearchOutputFormSharingCardProps = Pick<
  ResearchOutputPostRequest,
  | 'link'
  | 'title'
  | 'descriptionMD'
  | 'shortDescription'
  | 'sharingStatus'
  | 'subtype'
> & {
  researchOutputData?: ResearchOutputResponse;
  documentType?: ResearchOutputResponse['documentType'];
  isCreatingOutputRoute?: boolean;
  type?: ResearchOutputType | '';
  onChangeLink?: (newValue: string) => void;
  onChangeTitle?: (newValue: string) => void;
  onChangeDescription?: (newValue: string) => void;
  onChangeShortDescription?: (newValue: string) => void;
  onChangeType?: (newValue: ResearchOutputType | '') => void;
  onChangeSubtype?: (newValue: string | '') => void;
  onChangeAsapFunded?: (newValue: DecisionOption) => void;
  onChangeUsedInPublication?: (newValue: DecisionOption) => void;
  onChangeSharingStatus?: (newValue: ResearchOutputSharingStatus) => void;
  onChangePublishDate?: (newValue: Date | undefined) => void;
  isSaving: boolean;
  asapFunded: DecisionOption;
  usedInPublication: DecisionOption;
  publishDate?: Date;
  researchTags: ResearchTagResponse[];
  serverValidationErrors?: ValidationErrorResponse['data'];
  clearServerValidationError?: (instancePath: string) => void;
  typeDescription?: string;
  urlRequired?: boolean;
  typeOptions: ResearchOutputType[];
  getShortDescriptionFromDescription: (description: string) => Promise<string>;
};

export const getPublishDateValidationMessage = (e: ValidityState): string => {
  if (e.badInput) {
    return 'Date published should be complete or removed';
  }
  return 'Publish date cannot be greater than today';
};

const ResearchOutputFormSharingCard: React.FC<
  ResearchOutputFormSharingCardProps
> = ({
  researchOutputData,
  documentType,
  isCreatingOutputRoute,
  isSaving,
  link,
  title,
  descriptionMD,
  shortDescription,
  type,
  typeOptions,
  subtype,
  asapFunded,
  usedInPublication,
  sharingStatus,
  publishDate,
  researchTags,
  serverValidationErrors = [],
  typeDescription,
  urlRequired,
  getShortDescriptionFromDescription,
  clearServerValidationError = noop,
  onChangeDescription = noop,
  onChangeShortDescription = noop,
  onChangeLink = noop,
  onChangeTitle = noop,
  onChangeType = noop,
  onChangeSubtype = noop,
  onChangeAsapFunded = noop,
  onChangeUsedInPublication = noop,
  onChangeSharingStatus = noop,
  onChangePublishDate = noop,
}) => {
  const [urlValidationMessage, setUrlValidationMessage] = useState<string>();
  const [titleValidationMessage, setTitleValidationMessage] =
    useState<string>();

  const subtypeSuggestions = researchTags.filter(
    (tag) => tag.category === 'Subtype',
  );

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
      <LabeledTextField
        title="URL"
        subtitle={urlRequired ? '(required)' : '(optional)'}
        required={urlRequired}
        description="Use the link of your document (for example, google document link)."
        pattern={urlExpression}
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
        labelIndicator={<GlobeIcon />}
        placeholder="https://example.com"
      />
      {!!typeOptions.length && (
        <LabeledDropdown<ResearchOutputType | ''>
          title="Type"
          subtitle="(required)"
          description={typeDescription}
          options={typeOptions.map((option) => ({
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
      )}
      {!!subtypeSuggestions.length && (
        <LabeledDropdown
          title="Subtype"
          subtitle="(required)"
          options={subtypeSuggestions.map((sub) => ({
            label: sub.name,
            value: sub.name,
          }))}
          onChange={(selectedSubtype) => onChangeSubtype(selectedSubtype)}
          value={subtype ?? ''}
          required
          getValidationMessage={() => 'Please choose a subtype'}
          enabled={!isSaving}
          placeholder="Select subtype"
        />
      )}
      <LabeledTextEditor
        title="Description"
        subtitle="(required)"
        tip="Add an abstract or a summary that describes this work."
        onChange={onChangeDescription}
        getValidationMessage={() => 'Please enter a description'}
        required
        value={descriptionMD}
        info={
          <Markdown
            value={`**Markup Language**\n\n**Bold:** \\*\\*your text\\*\\*\n\n**Italic:** \\*your text\\*\n\n**H1:** \\# Your Text\n\n**H2:** \\#\\# Your Text\n\n**H3:** \\#\\#\\# Your Text\n\n**Superscript:** ^<p>Your Text</p>^\n\n**Subscript:** ~<p>Your Text</p>~\n\n**Hyperlink:** \\[your text](https://example.com)\n\n**New Paragraph:** To create a line break, you will need to press the enter button twice.
        `}
          ></Markdown>
        }
      />
      <OutputShortDescriptionCard
        onChange={onChangeShortDescription}
        buttonEnabled={descriptionMD.length > 0}
        enabled={!isSaving}
        value={shortDescription}
        getShortDescription={() =>
          getShortDescriptionFromDescription(descriptionMD)
        }
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
          {
            value: 'No',
            label: 'No',
            disabled:
              isCreatingOutputRoute &&
              documentType === 'Article' &&
              researchOutputData?.usedInPublication === undefined,
          },
          {
            value: 'Not Sure',
            label: 'Not Sure',
            disabled:
              isCreatingOutputRoute &&
              documentType === 'Article' &&
              researchOutputData?.usedInPublication === undefined,
          },
        ]}
        value={usedInPublication}
        onChange={onChangeUsedInPublication}
      />
      <LabeledRadioButtonGroup
        title="Sharing status"
        subtitle="(required)"
        options={[
          {
            value: 'Network Only',
            label: 'CRN Only',
            disabled:
              documentType === 'Article' &&
              researchOutputData?.sharingStatus === undefined,
          },
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
            'This should be the date your output was shared publicly on its repository.'
          }
          onChange={onChangePublishDate}
          value={publishDate}
          max={new Date()}
          getValidationMessage={(e) => getPublishDateValidationMessage(e)}
        />
      ) : null}
    </FormCard>
  );
};

export default ResearchOutputFormSharingCard;
