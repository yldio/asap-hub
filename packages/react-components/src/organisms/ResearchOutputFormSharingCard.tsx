import {
  ResearchOutputPostRequest,
  ResearchOutputType,
  ResearchTagResponse,
  ValidationErrorResponse,
} from '@asap-hub/model';
import { urlExpression } from '@asap-hub/validation';
import { ComponentPropsWithRef, useCallback, useEffect, useState } from 'react';
import { ResearchOutputAvailableActions } from '@asap-hub/react-context';
import { getAjvErrorForPath } from '../ajv-errors';
import { OptionsType } from '../select';
import { Markdown } from '../atoms';
import { MultiSelectOptionsType } from '../atoms/MultiSelect';
import { GlobeIcon } from '../icons';
import {
  FormCard,
  LabeledDropdown,
  LabeledMultiSelect,
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
  | 'layImpactStatement'
  | 'shortDescription'
  | 'changelog'
  | 'subtype'
> &
  Pick<ResearchOutputAvailableActions, 'showImpactAndCategory'> & {
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
    type?: ResearchOutputType | '';
    onChangeLink?: (newValue: string) => void;
    onChangeTitle?: (newValue: string) => void;
    onChangeDescription?: (newValue: string) => void;
    onChangeShortDescription?: (newValue: string) => void;
    onChangeLayImpactStatement?: (newValue: string) => void;
    onChangeChangelog?: (newValue: string) => void;
    onChangeType?: (newValue: ResearchOutputType | '') => void;
    onChangeSubtype?: (newValue: string | '') => void;
    isSaving: boolean;
    researchTags: ResearchTagResponse[];
    serverValidationErrors?: ValidationErrorResponse['data'];
    clearServerValidationError?: (instancePath: string) => void;
    typeDescription?: string;
    urlRequired?: boolean;
    typeOptions: ResearchOutputType[];
    getShortDescriptionFromDescription: (
      description: string,
    ) => Promise<string>;
  };

const ResearchOutputFormSharingCard: React.FC<
  ResearchOutputFormSharingCardProps
> = ({
  showImpactAndCategory,
  isFormSubmitted,
  isCreatingNewVersion,
  getImpactSuggestions,
  impact,
  layImpactStatement,
  onChangeImpact,
  getCategorySuggestions = noop,
  categories,
  onChangeCategories,
  displayChangelog = false,
  isSaving,
  link,
  title,
  descriptionMD,
  shortDescription,
  changelog,
  type,
  typeOptions,
  subtype,
  researchTags,
  serverValidationErrors = [],
  typeDescription,
  urlRequired,
  getShortDescriptionFromDescription,
  clearServerValidationError = noop,
  onChangeDescription = noop,
  onChangeShortDescription = noop,
  onChangeChangelog = noop,
  onChangeLink = noop,
  onChangeTitle = noop,
  onChangeType = noop,
  onChangeSubtype = noop,
  onChangeLayImpactStatement = noop,
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
  const [layImpactValidationMessage, setLayImpactValidationMessage] =
    useState<string>();

  const subtypeSuggestions = researchTags.filter(
    (tag) => tag.category === 'Subtype',
  );

  const validateFieldWithCharLimit = (
    newValue: string,
    field: string,
    limit: number,
    setValidationMessage: (message: string | undefined) => void,
  ) => {
    setValidationMessage(
      newValue.length >= limit
        ? `The ${field} exceeds the character limit. Please limit it to ${limit} characters.`
        : newValue.trim().length === 0
          ? `Please enter a ${field}`
          : undefined,
    );
  };
  const [impactOptions, setImpactOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    if (!showImpactAndCategory) return;

    const loadImpactOptions = async () => {
      const options = await getImpactSuggestions('');
      setImpactOptions(options);
    };

    void loadImpactOptions();
  }, [showImpactAndCategory, getImpactSuggestions]);

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
    if (isFormSubmitted && showImpactAndCategory) {
      validateImpact();
    }
  }, [isFormSubmitted, validateImpact, showImpactAndCategory]);

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
          description="Select the subtype that matches your output the best."
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
        tip="Add an abstract or a summary that describes this work. You can format your text by using markup language."
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
          validateFieldWithCharLimit(
            shortDescriptionNewValue,
            'short description',
            250,
            setShortDescriptionValidationMessage,
          );
        }}
        buttonEnabled={descriptionMD.length > 0}
        enabled={!isSaving}
        value={shortDescription}
        tip="Use AI to generate a short description or write your own based on the description field above."
        getShortDescription={() =>
          getShortDescriptionFromDescription(descriptionMD)
        }
        customValidationMessage={shortDescriptionValidationMessage}
      />

      {showImpactAndCategory && (
        <>
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
          <LabeledDropdown
            required
            getValidationMessage={() => 'Please choose an impact.'}
            title="Impact"
            subtitle="(required)"
            description="Select the option that best describes the impact of this manuscript on the PD field."
            options={impactOptions}
            onChange={(e) => {
              const impactOption = impactOptions.find(
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
          <LabeledTextArea
            value={layImpactStatement ?? ''}
            onChange={(layImpactNewValue) => {
              onChangeLayImpactStatement(layImpactNewValue);
              validateFieldWithCharLimit(
                layImpactNewValue,
                'lay impact statement',
                100,
                setLayImpactValidationMessage,
              );
            }}
            enabled={!isSaving}
            required
            title="Lay Impact Statement"
            subtitle="(required)"
            tip={
              'Explain in plain language why this work matters and how it may impact research, patients, or the wider community.'
            }
            customValidationMessage={layImpactValidationMessage}
          />
        </>
      )}
      {displayChangelog && (
        <LabeledTextArea
          title="Changelog"
          subtitle="(required)"
          tip="Briefly explain what’s new or changed in this version in comparison to the prior version of the manuscript."
          customValidationMessage={changelogValidationMessage}
          value={changelog ?? ''}
          onChange={(changelogNewValue) => {
            onChangeChangelog(changelogNewValue);
            validateFieldWithCharLimit(
              changelogNewValue,
              'changelog',
              250,
              setChangelogValidationMessage,
            );
          }}
          required
          enabled={!isSaving}
        />
      )}
    </FormCard>
  );
};

export default ResearchOutputFormSharingCard;
