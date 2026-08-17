import { ResearchOutputType, ResearchTagResponse } from '@asap-hub/model';
import { urlExpression } from '@asap-hub/validation';
import { ComponentPropsWithRef, useEffect, useState } from 'react';
import { ResearchOutputAvailableActions } from '@asap-hub/react-context';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
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
import { noop, ResearchOutputFormValues } from '../utils';
import ShortDescriptionCard from './ShortDescriptionCard';

type ResearchOutputFormSharingCardProps = Pick<
  ResearchOutputAvailableActions,
  | 'showImpactAndCategory'
  | 'disableImpactAndCategory'
  | 'showChangelogAndVersionHistory'
> & {
  getImpactSuggestions: (
    searchQuery: string,
  ) => Promise<{ label: string; value: string }[]>;
  getCategorySuggestions: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['loadOptions'];
  researchTags: ResearchTagResponse[];
  urlRequired?: boolean;
  typeOptions: ResearchOutputType[];
  getShortDescriptionFromDescription: (description: string) => Promise<string>;
  isSaving?: boolean;
};

const ResearchOutputFormSharingCard: React.FC<
  ResearchOutputFormSharingCardProps
> = ({
  showImpactAndCategory,
  disableImpactAndCategory,
  showChangelogAndVersionHistory: displayChangelog,
  getImpactSuggestions,
  getCategorySuggestions = noop,
  typeOptions,
  researchTags,
  urlRequired,
  getShortDescriptionFromDescription,
  isSaving = false,
}) => {
  const { control, setValue } = useFormContext<ResearchOutputFormValues>();
  const descriptionMD = useWatch({ control, name: 'descriptionMD' });

  const subtypeSuggestions = researchTags.filter(
    (tag) => tag.category === 'Subtype',
  );

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

  const clearTagFieldsOnTypeChange = () => {
    setValue('methods', []);
    setValue('organisms', []);
    setValue('environments', []);
    setValue('subtype', '');
    setValue('keywords', []);
  };

  return (
    <FormCard title="What are you sharing?">
      <Controller
        name="title"
        control={control}
        rules={{
          required: 'Please enter a title.',
          maxLength: {
            value: 350,
            message: 'This title cannot exceed 350 characters.',
          },
        }}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <LabeledTextField
            title="Title"
            subtitle="(required)"
            maxLength={350}
            onChange={onChange}
            customValidationMessage={error?.message}
            value={value}
            onBlur={onBlur}
            enabled={!isSaving}
          />
        )}
      />
      <Controller
        name="link"
        control={control}
        rules={{
          required: urlRequired
            ? 'Please enter a valid URL, starting with http://'
            : false,
          pattern: {
            value: new RegExp(urlExpression),
            message: 'Please enter a valid URL, starting with http://',
          },
        }}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <LabeledTextField
            title="URL"
            description="Use the link of your document (for example, google document link)."
            subtitle={urlRequired ? '(required)' : '(optional)'}
            placeholder="https://example.com"
            onChange={onChange}
            value={value ?? ''}
            customValidationMessage={error?.message}
            onBlur={onBlur}
            enabled={!isSaving}
            labelIndicator={<GlobeIcon />}
          />
        )}
      />
      {!!typeOptions.length && (
        <Controller
          name="type"
          control={control}
          rules={{
            required: 'Please choose a type.',
          }}
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <LabeledDropdown<ResearchOutputType | ''>
              title="Type"
              subtitle="(required)"
              description="Select the type that matches your output the best."
              placeholder="Choose a type"
              required
              options={typeOptions.map((option) => ({
                value: option,
                label: option,
              }))}
              onChange={(selectedType) => {
                onChange(selectedType);
                clearTagFieldsOnTypeChange();
              }}
              onBlur={onBlur}
              value={value ?? ''}
              enabled={!isSaving}
              customValidationMessage={error?.message}
              noOptionsMessage={(option) =>
                `Sorry, no types match ${option.inputValue}`
              }
            />
          )}
        />
      )}
      {!!subtypeSuggestions.length && (
        <Controller
          name="subtype"
          control={control}
          rules={{
            required: 'Please choose a subtype.',
          }}
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <LabeledDropdown
              title="Subtype"
              subtitle="(required)"
              description="Select the subtype that matches your output the best."
              placeholder="Select subtype"
              required
              options={subtypeSuggestions.map((sub) => ({
                label: sub.name,
                value: sub.name,
              }))}
              // Empty is '' rather than undefined so it matches the default
              // value and what clearing the field writes. RHF also falls back
              // to the registered default when a field is set to undefined,
              // which would leave a stale subtype on screen.
              onChange={(selectedSubtype) => onChange(selectedSubtype || '')}
              value={value ?? ''}
              onBlur={onBlur}
              customValidationMessage={error?.message}
              enabled={!isSaving}
            />
          )}
        />
      )}
      <Controller
        name="descriptionMD"
        control={control}
        rules={{
          required: 'Please enter a description.',
        }}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <LabeledTextEditor
            title="Description"
            subtitle="(required)"
            tip="Add an abstract or a summary that describes this work. You can format your text by using markup language."
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            enabled={!isSaving}
            customValidationMessage={error?.message}
            info={
              <Markdown
                value={`**Markup Language**\n\n**Bold:** \\*\\*your text\\*\\*\n\n**Italic:** \\*your text\\*\n\n**H1:** \\# Your Text\n\n**H2:** \\#\\# Your Text\n\n**H3:** \\#\\#\\# Your Text\n\n**Superscript:** ^<p>Your Text</p>^\n\n**Subscript:** ~<p>Your Text</p>~\n\n**Hyperlink:** \\[your text](https://example.com)\n\n**New Paragraph:** To create a line break, you will need to press the enter button twice.
        `}
              ></Markdown>
            }
            autofocus={false}
          />
        )}
      />
      <Controller
        name="shortDescription"
        control={control}
        rules={{
          required: 'Please enter a short description.',
          maxLength: {
            value: 250,
            message:
              'The short description exceeds the character limit. Please limit it to 250 characters.',
          },
          validate: (value) =>
            (value ?? '').trim().length > 0 ||
            'Please enter a short description',
        }}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <ShortDescriptionCard
            onChange={(shortDescriptionNewValue) => {
              onChange(shortDescriptionNewValue);
            }}
            onBlur={onBlur}
            buttonEnabled={(descriptionMD?.length ?? 0) > 0}
            enabled={!isSaving}
            value={value ?? ''}
            tip="Use AI to generate a short description or write your own based on the description field above."
            getShortDescription={() =>
              getShortDescriptionFromDescription(descriptionMD || '')
            }
            customValidationMessage={error?.message}
          />
        )}
      />

      {showImpactAndCategory && (
        <>
          <Controller
            name="categories"
            control={control}
            rules={{
              validate: (value) => {
                const selectedCategories = value ?? [];

                if (selectedCategories.length === 0)
                  return 'Please add at least one category.';

                return (
                  selectedCategories.length <= 2 ||
                  'You can select up to two categories only.'
                );
              },
            }}
            render={({
              field: { value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <LabeledMultiSelect
                title="Category"
                description="Select up to two options that best describe the scientific category of this output."
                subtitle="(required)"
                enabled={!isSaving && !disableImpactAndCategory}
                placeholder="Start typing..."
                loadOptions={getCategorySuggestions}
                onChange={(newValues) =>
                  onChange(
                    newValues as MultiSelectOptionsType &
                      OptionsType<MultiSelectOptionsType>,
                  )
                }
                onBlur={onBlur}
                customValidationMessage={error?.message}
                values={value as OptionsType<MultiSelectOptionsType>}
                noOptionsMessage={({ inputValue }) =>
                  `Sorry, no category options match ${inputValue}`
                }
              />
            )}
          />
          <Controller
            name="impact"
            control={control}
            rules={{
              validate: (value) =>
                !!value?.value || 'Please add at least one impact.',
            }}
            render={({
              field: { value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <LabeledDropdown
                title="Impact"
                subtitle="(required)"
                description="Select the option that best describes the impact of this output on the PD field."
                placeholder="Choose an impact"
                required
                options={impactOptions}
                onChange={(e) => {
                  const impactOption = impactOptions.find(
                    (option) => option.value === e,
                  );
                  onChange(
                    impactOption as MultiSelectOptionsType &
                      OptionsType<MultiSelectOptionsType>,
                  );
                }}
                onBlur={onBlur}
                customValidationMessage={error?.message}
                value={value?.value ?? ''}
                enabled={!isSaving && !disableImpactAndCategory}
                noOptionsMessage={(option) =>
                  `Sorry, no impacts match ${option.inputValue}`
                }
              />
            )}
          />
          <Controller
            name="layImpactStatement"
            control={control}
            rules={{
              required: 'Please enter a lay impact statement.',
              maxLength: {
                value: 100,
                message:
                  'The lay impact statement exceeds the character limit. Please limit it to 100 characters.',
              },
              validate: (value) =>
                (value ?? '').trim().length > 0 ||
                'Please enter a lay impact statement',
            }}
            render={({
              field: { value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <LabeledTextArea
                title="Lay Impact Statement"
                subtitle="(required)"
                tip={
                  'Explain in plain language why this work matters and how it may impact research, patients, or the wider community.'
                }
                value={value ?? ''}
                onChange={onChange}
                onBlur={onBlur}
                enabled={!isSaving}
                customValidationMessage={error?.message}
              />
            )}
          />
        </>
      )}
      {displayChangelog && (
        <Controller
          name="changelog"
          control={control}
          rules={{
            required: 'Please enter a changelog.',
            maxLength: {
              value: 250,
              message:
                'The changelog exceeds the character limit. Please limit it to 250 characters.',
            },
            validate: (value) =>
              (value ?? '').trim().length > 0 || 'Please enter a changelog',
          }}
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <LabeledTextArea
              title="Changelog"
              subtitle="(required)"
              tip="Briefly explain what’s new or changed in this version in comparison to the prior version of the output."
              customValidationMessage={error?.message}
              value={value ?? ''}
              onChange={onChange}
              onBlur={onBlur}
              enabled={!isSaving}
            />
          )}
        />
      )}
    </FormCard>
  );
};

export default ResearchOutputFormSharingCard;
