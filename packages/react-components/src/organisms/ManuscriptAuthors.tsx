import { AuthorSelectOption, ManuscriptFormData } from '@asap-hub/model';
import { ComponentProps, useEffect } from 'react';
import {
  Control,
  Controller,
  useFieldArray,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form';
import { LabeledTextField, OptionsType } from '..';
import AuthorSelect, { AuthorOption } from './AuthorSelect';

type ManuscriptAuthorsProps = {
  control: Control<ManuscriptFormData>;
  fieldDescription: string;
  fieldEmailDescription: string;
  fieldName: 'firstAuthors' | 'correspondingAuthor' | 'additionalAuthors';
  fieldTitle: string;
  getAuthorSuggestions: NonNullable<
    ComponentProps<typeof AuthorSelect>['loadOptions']
  >;
  getValues: UseFormGetValues<ManuscriptFormData>;
  isSubmitting: boolean;
  isMultiSelect?: ComponentProps<typeof AuthorSelect>['isMulti'];
  isRequired?: boolean;
  trigger: UseFormTrigger<ManuscriptFormData>;
  setValue: UseFormSetValue<ManuscriptFormData>;
  validate?: (
    authors: AuthorSelectOption[],
  ) => true | string | Promise<true | string>;
};

const ManuscriptAuthors = ({
  control,
  fieldDescription,
  fieldEmailDescription,
  fieldName,
  fieldTitle,
  getAuthorSuggestions,
  getValues,
  isSubmitting,
  trigger,
  setValue,
  validate,
  isMultiSelect = false,
  isRequired = false,
}: ManuscriptAuthorsProps) => {
  const { append, fields, remove } = useFieldArray({
    control,
    name: `versions.0.${fieldName}Emails`,
  });

  useEffect(() => {
    const authors = getValues(`versions.0.${fieldName}`);
    (authors || []).forEach(({ author }) => {
      if (author && !('firstName' in author) && author.displayName) {
        append({
          name: author.displayName || '',
          email: author?.email || '',
        });
      }
    });
  }, [append, getValues, fieldName]);

  return (
    <>
      <Controller
        name={`versions.0.${fieldName}`}
        control={control}
        rules={{ validate }}
        render={({
          field: { value: authors, onChange },
          fieldState: { error },
        }) => (
          <AuthorSelect
            useDefaultErrorMessage={false}
            isMulti={isMultiSelect}
            customValidationMessage={error?.message}
            // This extra Boolean(error?.message) is necessary
            // in order to not trigger MultiSelect inner validation
            required={isRequired && Boolean(error?.message)}
            title={fieldTitle}
            description={fieldDescription}
            subtitle={isRequired ? '(required)' : '(optional)'}
            enabled={!isSubmitting}
            placeholder="Start typing..."
            loadOptions={getAuthorSuggestions}
            onChange={async (
              newAuthors: OptionsType<AuthorOption> | AuthorOption | null,
            ) => {
              const normalizedAuthors = Array.isArray(newAuthors)
                ? newAuthors
                : newAuthors
                  ? [newAuthors]
                  : [];

              const currentAuthors = authors || [];

              const hasAdded = normalizedAuthors.length > currentAuthors.length;
              const hasRemoved =
                normalizedAuthors.length < currentAuthors.length;

              const hasReplaced =
                normalizedAuthors.length === currentAuthors.length &&
                normalizedAuthors.length === 1 &&
                normalizedAuthors[0]?.value !== currentAuthors[0]?.value;

              // Handle newly added or replaced author
              if (hasAdded || hasReplaced) {
                const addedAuthor = normalizedAuthors.at(-1);
                if (addedAuthor) {
                  if (!addedAuthor.author) {
                    append({ name: addedAuthor.label, email: '' });
                  } else if (
                    // eslint-disable-next-line no-underscore-dangle
                    addedAuthor.author.__meta.type === 'external-author'
                  ) {
                    append({
                      name: addedAuthor.label,
                      email: '',
                      id: addedAuthor.author.id,
                    });
                  }
                }
              }

              // Handle removed or replaced author
              if (hasRemoved || hasReplaced) {
                const fieldValues = getValues(`versions.0.${fieldName}Emails`);

                const externalAuthors = normalizedAuthors.filter(
                  (item) => !item.author,
                );

                const deletedIndex = fieldValues.findIndex(
                  (item) =>
                    !externalAuthors.some(
                      (externalAuthor) => externalAuthor.label === item.name,
                    ),
                );

                if (deletedIndex > -1) {
                  remove(deletedIndex);
                }
              }

              setValue(`versions.0.${fieldName}`, normalizedAuthors, {
                shouldValidate: true,
                shouldTouch: true,
              });

              setTimeout(async () => {
                await trigger(`versions.0.${fieldName}`);
              }, 0);
            }}
            values={authors || []}
            noOptionsMessage={({ inputValue }) =>
              `Sorry, no authors match ${inputValue}`
            }
          />
        )}
      />

      {fields.map((field, index) => (
        <div key={field.id}>
          <Controller
            name={`versions.0.${fieldName}Emails.${index}.email`}
            control={control}
            rules={{
              required: 'Please add an email address for any non-CRN authors.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                message: 'Please enter a valid email.',
              },
            }}
            render={({
              field: { value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <LabeledTextField
                required
                type="email"
                title={`${field.name} Email`}
                subtitle="(required)"
                description={fieldEmailDescription}
                customValidationMessage={error?.message}
                value={value}
                onChange={(newValue) => {
                  onChange(newValue);
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  trigger(`versions.0.${fieldName}Emails.${index}.email`);
                }}
                onBlur={onBlur}
                enabled={!isSubmitting}
              />
            )}
          />
        </div>
      ))}
    </>
  );
};

export default ManuscriptAuthors;
