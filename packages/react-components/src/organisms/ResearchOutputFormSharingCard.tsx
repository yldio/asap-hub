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
import { css } from '@emotion/react';
import { ComponentPropsWithRef, useCallback, useEffect, useState } from 'react';
import { OptionsType } from 'react-select';
import { getAjvErrorForPath } from '../ajv-errors';
import { Markdown } from '../atoms';
import { MultiSelectOptionsType } from '../atoms/MultiSelect';
import { GlobeIcon } from '../icons';
import {
  FormCard,
  LabeledDateField,
  LabeledDropdown,
  LabeledMultiSelect,
  LabeledRadioButtonGroup,
  LabeledTextArea,
  LabeledTextEditor,
  LabeledTextField,
} from '../molecules';
import { noop } from '../utils';
import ShortDescriptionCard from './ShortDescriptionCard';

type ResearchOutputFormSharingCardProps = Pick<
  ResearchOutputPostRequest,
  | 'link'
  | 'title'
  | 'descriptionMD'
  | 'shortDescription'
  | 'changelog'
  | 'sharingStatus'
  | 'subtype'
> & {
  isFormSubmitted: boolean;
  isCreatingNewVersion: boolean;
  getImpactSuggestions: (
    searchQuery: string,
  ) => Promise<{ label: string; value: string }[]>;
  impact?: MultiSelectOptionsType;
  onChangeImpact: (
    newValue: MultiSelectOptionsType & OptionsType<MultiSelectOptionsType>,
  ) => void;
  getCategorySuggestions: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['loadOptions'];
  categories: ComponentPropsWithRef<typeof LabeledMultiSelect>['values'];
  onChangeCategories: NonNullable<
    ComponentPropsWithRef<typeof LabeledMultiSelect>['onChange']
  >;
  displayChangelog?: boolean;
  researchOutputData?: ResearchOutputResponse;
  documentType?: ResearchOutputResponse['documentType'];
  isCreatingOutputRoute?: boolean;
  type?: ResearchOutputType | '';
  onChangeLink?: (newValue: string) => void;
  onChangeTitle?: (newValue: string) => void;
  onChangeDescription?: (newValue: string) => void;
  onChangeShortDescription?: (newValue: string) => void;
  onChangeChangelog?: (newValue: string) => void;
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
  isImportedFromManuscript?: boolean;
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
  isFormSubmitted,
  isCreatingNewVersion,
  getImpactSuggestions,
  impact,
  onChangeImpact,
  getCategorySuggestions = noop,
  categories,
  onChangeCategories,
  displayChangelog = false,
  researchOutputData,
  documentType,
  isCreatingOutputRoute,
  isSaving,
  link,
  title,
  descriptionMD,
  shortDescription,
  changelog,
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
  isImportedFromManuscript,
  getShortDescriptionFromDescription,
  clearServerValidationError = noop,
  onChangeDescription = noop,
  onChangeShortDescription = noop,
  onChangeChangelog = noop,
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
  const [
    shortDescriptionValidationMessage,
    setShortDescriptionValidationMessage,
  ] = useState<string>();
  const [changelogValidationMessage, setChangelogValidationMessage] =
    useState<string>();
  const [categoryValidationMessage, setCategoryValidationMessage] =
    useState<string>();

  const subtypeSuggestions = researchTags.filter(
    (tag) => tag.category === 'Subtype',
  );

  const validateFieldWith250CharLimit = (
    newValue: string,
    field: string,
    setValidationMessage: (message: string | undefined) => void,
  ) => {
    setValidationMessage(
      newValue.length >= 250
        ? `The ${field} exceeds the character limit. Please limit it to 250 characters.`
        : newValue.trim().length === 0
          ? `Please enter a ${field}`
          : undefined,
    );
  };
  const [impactOtions, setImpactOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  const getImpactOptions = useCallback(async () => {
    const impactOptions = await getImpactSuggestions('');
    setImpactOptions(impactOptions || []);
  }, [getImpactSuggestions]);

  useEffect(() => {
    const fetchImpactOptions = async () => {
      if (documentType === 'Article') {
        await getImpactOptions();
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchImpactOptions();
  }, [getImpactOptions, documentType]);

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

  const [impactValidationMessage, setImpactValidationMessage] =
    useState<string>();
  const validateImpact = useCallback(() => {
    setImpactValidationMessage(
      !impact || (impact.value && impact.value.length === 0)
        ? 'Please add at least one impact.'
        : undefined,
    );
  }, [impact]);

  useEffect(() => {
    validateImpact();
  }, [impact, validateImpact]);

  const validateCategories = useCallback(
    (newValues: OptionsType<MultiSelectOptionsType>) => {
      const isValidSelection =
        ((newValues as OptionsType<MultiSelectOptionsType>) || []).length <= 2;

      setCategoryValidationMessage(
        isValidSelection
          ? undefined
          : 'You can select up to two categories only.',
      );
    },
    [],
  );

  useEffect(() => {
    if (isFormSubmitted && documentType === 'Article') {
      validateImpact();
    }
  }, [isFormSubmitted, validateImpact, documentType]);

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

      {documentType === 'Article' && (
        <LabeledDropdown
          required
          getValidationMessage={() => 'Please choose an impact.'}
          title="Impact"
          subtitle="(required)"
          description="Select the option that best describes the impact of this manuscript on the PD field."
          options={impactOtions}
          onChange={(e) => {
            const impactOption = impactOtions.find(
              (option) => option.value === e,
            );
            onChangeImpact(
              impactOption as MultiSelectOptionsType &
                OptionsType<MultiSelectOptionsType>,
            );
          }}
          onBlur={validateImpact}
          customValidationMessage={impactValidationMessage}
          value={impact?.value ?? ''}
          enabled={!isSaving && !isCreatingNewVersion}
          noOptionsMessage={(option) =>
            `Sorry, no impacts match ${option.inputValue}`
          }
          placeholder="Choose an impact"
        />
      )}
      {documentType === 'Article' && (
        <LabeledMultiSelect
          required
          getValidationMessage={(validationState) =>
            validationState.valueMissing
              ? 'Please add at least one category.'
              : 'You can select up to two categories only.'
          }
          title="Category"
          description="Select up to two options that best describe the scientific category of this manuscript."
          subtitle="(required)"
          enabled={!isSaving && !isCreatingNewVersion}
          placeholder="Start typing..."
          loadOptions={getCategorySuggestions}
          onChange={(newValues) => {
            onChangeCategories(
              newValues as MultiSelectOptionsType &
                OptionsType<MultiSelectOptionsType>,
            );
            validateCategories(newValues);
          }}
          customValidationMessage={categoryValidationMessage}
          values={categories as OptionsType<MultiSelectOptionsType>}
          noOptionsMessage={({ inputValue }) =>
            `Sorry, no category options match ${inputValue}`
          }
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
        enabled={!isSaving}
        info={
          <Markdown
            value={`**Markup Language**\n\n**Bold:** \\*\\*your text\\*\\*\n\n**Italic:** \\*your text\\*\n\n**H1:** \\# Your Text\n\n**H2:** \\#\\# Your Text\n\n**H3:** \\#\\#\\# Your Text\n\n**Superscript:** ^<p>Your Text</p>^\n\n**Subscript:** ~<p>Your Text</p>~\n\n**Hyperlink:** \\[your text](https://example.com)\n\n**New Paragraph:** To create a line break, you will need to press the enter button twice.
        `}
          ></Markdown>
        }
        autofocus={false}
      />
      <ShortDescriptionCard
        onChange={(shortDescriptionNewValue) => {
          onChangeShortDescription(shortDescriptionNewValue);
          validateFieldWith250CharLimit(
            shortDescriptionNewValue,
            'short description',
            setShortDescriptionValidationMessage,
          );
        }}
        buttonEnabled={descriptionMD.length > 0}
        enabled={!isSaving}
        value={shortDescription}
        getShortDescription={() =>
          getShortDescriptionFromDescription(descriptionMD)
        }
        customValidationMessage={shortDescriptionValidationMessage}
      />
      {displayChangelog && (
        <LabeledTextArea
          title="Changelog"
          subtitle="(required)"
          tip="Briefly explain what’s new or changed in this version in comparison to the prior version of the manuscript."
          customValidationMessage={changelogValidationMessage}
          value={changelog ?? ''}
          onChange={(changelogNewValue) => {
            onChangeChangelog(changelogNewValue);
            validateFieldWith250CharLimit(
              changelogNewValue,
              'changelog',
              setChangelogValidationMessage,
            );
          }}
          required
          enabled={!isSaving}
        />
      )}
      <div css={css({ marginTop: '30px' })}>
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
      </div>
      <div
        css={css({
          marginTop: '48px',
        })}
      >
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
      </div>
      <div
        css={css({
          marginTop: '48px',
        })}
      >
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
      </div>
      {sharingStatus === 'Public' ? (
        <div css={css({ marginTop: '36px' })}>
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
        </div>
      ) : null}
    </FormCard>
  );
};

export default ResearchOutputFormSharingCard;
