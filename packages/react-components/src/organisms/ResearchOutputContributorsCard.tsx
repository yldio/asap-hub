import { ComponentPropsWithRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MultiSelectOptionsType } from '../atoms';
import { OptionsType } from '../select';
import { MultiSelectOnChange } from '../atoms/MultiSelect';

import { FormCard, LabeledMultiSelect } from '../molecules';
import { noop, ResearchOutputFormValues } from '../utils';
import AuthorSelect from './AuthorSelect';

type ResearchOutputContributorsProps = {
  readonly getLabSuggestions?: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['loadOptions'];
  readonly getAuthorSuggestions?: ComponentPropsWithRef<
    typeof AuthorSelect
  >['loadOptions'];
  readonly getTeamSuggestions?: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['loadOptions'];
  isSaving?: boolean;
  isEditMode?: boolean;
  authorsRequired?: boolean;
};

const ResearchOutputContributorsCard: React.FC<
  ResearchOutputContributorsProps
> = ({
  getAuthorSuggestions = noop,
  getLabSuggestions = noop,
  getTeamSuggestions = noop,
  isSaving = false,
  isEditMode,
  authorsRequired,
}) => {
  const { control } = useFormContext<ResearchOutputFormValues>();

  return (
    <FormCard title="Who were the contributors?">
      <Controller
        name="teams"
        control={control}
        rules={{ required: 'Please add at least one team.' }}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <LabeledMultiSelect
            title="Teams"
            description="Add other teams that contributed to this output. Each author and each lab's Lead PI must have one team listed. Those teams will also then be able to edit."
            subtitle="(required)"
            enabled={!isSaving || !isEditMode}
            placeholder="Start typing..."
            loadOptions={getTeamSuggestions}
            onChange={onChange as MultiSelectOnChange<MultiSelectOptionsType>}
            onBlur={onBlur}
            customValidationMessage={error?.message}
            values={value as OptionsType<MultiSelectOptionsType>}
            noOptionsMessage={({ inputValue }) =>
              `Sorry, no teams match ${inputValue}`
            }
          />
        )}
      />
      <Controller
        name="authors"
        control={control}
        rules={{
          required: authorsRequired
            ? 'Please select at least one author.'
            : false,
        }}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <AuthorSelect
            title="Authors"
            description="Add the contributing authors. Each author must have one of their teams listed in the Teams field."
            subtitle={authorsRequired ? '(required)' : '(optional)'}
            enabled={!isSaving}
            placeholder="Start typing..."
            loadOptions={getAuthorSuggestions}
            onChange={onChange}
            onBlur={onBlur}
            useDefaultErrorMessage={false}
            customValidationMessage={error?.message}
            values={value}
            noOptionsMessage={({ inputValue }) =>
              `Sorry, no authors match ${inputValue}`
            }
          />
        )}
      />
      <Controller
        name="labs"
        control={control}
        rules={{ required: 'Please add at least one lab.' }}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <LabeledMultiSelect
            title="Labs"
            description="Add ASAP labs that contributed to this output. The Lead PI of each lab must have one of their teams listed in the Teams field. Only labs with ASAP registered PI's will appear."
            subtitle="(required)"
            enabled={!isSaving}
            placeholder="Start typing..."
            loadOptions={getLabSuggestions}
            onChange={onChange as MultiSelectOnChange<MultiSelectOptionsType>}
            onBlur={onBlur}
            customValidationMessage={error?.message}
            values={value as OptionsType<MultiSelectOptionsType>}
            noOptionsMessage={({ inputValue }) =>
              `Sorry, no labs match ${inputValue}`
            }
          />
        )}
      />
    </FormCard>
  );
};
export default ResearchOutputContributorsCard;
