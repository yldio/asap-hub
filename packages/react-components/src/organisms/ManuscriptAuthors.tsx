import { AuthorAlgoliaResponse, ManuscriptFormData } from '@asap-hub/model';
import { ComponentProps } from 'react';
import {
  Control,
  Controller,
  useFieldArray,
  UseFormGetValues,
  UseFormTrigger,
} from 'react-hook-form';
import { OptionsType } from 'react-select';
import { LabeledTextField, MultiSelectOptionsType } from '..';
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
};

export type ManuscriptAuthorOption = {
  author?: AuthorAlgoliaResponse;
} & MultiSelectOptionsType;

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
  isMultiSelect = false,
  isRequired = false,
}: ManuscriptAuthorsProps) => {
  const { append, fields, remove } = useFieldArray({
    control,
    name: `versions.0.${fieldName}Emails`,
  });
  return (
    <>
      <Controller
        name={`versions.0.${fieldName}`}
        control={control}
        rules={
          isRequired
            ? {
                required: 'Please add at least one author.',
              }
            : {}
        }
        render={({
          field: { value: authors, onChange },
          fieldState: { error },
        }) => (
          <AuthorSelect
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
            onChange={(
              newAuthors: OptionsType<AuthorOption> | AuthorOption | null,
            ) => {
              if (isMultiSelect && Array.isArray(newAuthors)) {
                const hasAuthorBeenAdded = Boolean(
                  (newAuthors?.length ?? 0) > (authors?.length ?? 0),
                );

                if (hasAuthorBeenAdded) {
                  const lastAuthorAdded = newAuthors.at(-1);
                  if (!lastAuthorAdded?.author) {
                    append({
                      name: lastAuthorAdded.label,
                      email: '',
                    });
                  } else if (
                    // eslint-disable-next-line no-underscore-dangle
                    lastAuthorAdded.author.__meta.type === 'external-author'
                  ) {
                    append({
                      name: lastAuthorAdded.label,
                      email: '',
                      id: lastAuthorAdded.author.id,
                    });
                  }
                } else {
                  const fieldValues = getValues(
                    `versions.0.${fieldName}Emails`,
                  );

                  const externalAuthors = newAuthors?.filter(
                    (item) => !item.author,
                  );

                  const deletedAuthorIndex = fieldValues.findIndex(
                    (item) =>
                      !externalAuthors.some(
                        (externalAuthor) => externalAuthor.label === item.name,
                      ),
                  );

                  if (deletedAuthorIndex > -1) {
                    remove(deletedAuthorIndex);
                  }
                }
                (
                  onChange as (
                    newValues: OptionsType<ManuscriptAuthorOption>,
                  ) => void
                )(newAuthors);
              } else {
                if (newAuthors) {
                  const lastAuthorAdded = newAuthors as ManuscriptAuthorOption;
                  if (!lastAuthorAdded?.author) {
                    append({
                      name: lastAuthorAdded.label,
                      email: '',
                    });
                  } else if (
                    // eslint-disable-next-line no-underscore-dangle
                    lastAuthorAdded.author.__meta.type === 'external-author'
                  ) {
                    append({
                      name: lastAuthorAdded.label,
                      email: '',
                      id: lastAuthorAdded.author.id,
                    });
                  }
                } else {
                  remove(0);
                }

                (
                  onChange as (newValues: ManuscriptAuthorOption | null) => void
                )(newAuthors as ManuscriptAuthorOption | null);
              }
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
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                message: 'Please enter a valid email.',
              },
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
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
