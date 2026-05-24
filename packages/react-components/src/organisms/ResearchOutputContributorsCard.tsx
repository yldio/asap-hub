import { ComponentPropsWithRef } from 'react';
import { MultiSelectOptionsType } from '../atoms';
import { OptionsType } from '../select';
import { MultiSelectOnChange } from '../atoms/MultiSelect';

import { FormCard, LabeledMultiSelect } from '../molecules';
import { noop } from '../utils';
import AuthorSelect from './AuthorSelect';

type ResearchOutputContributorsProps = {
  readonly labs: ComponentPropsWithRef<typeof LabeledMultiSelect>['values'];
  readonly getLabSuggestions?: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['loadOptions'];
  readonly onChangeLabs?: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['onChange'];

  readonly authors: ComponentPropsWithRef<typeof AuthorSelect>['values'];
  readonly getAuthorSuggestions?: ComponentPropsWithRef<
    typeof AuthorSelect
  >['loadOptions'];
  readonly onChangeAuthors?: ComponentPropsWithRef<
    typeof AuthorSelect
  >['onChange'];

  readonly teams: ComponentPropsWithRef<typeof LabeledMultiSelect>['values'];
  readonly getTeamSuggestions?: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['loadOptions'];
  readonly onChangeTeams?: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['onChange'];

  readonly isSaving: boolean;
  isEditMode?: boolean;
  authorsRequired?: boolean;
};

const ResearchOutputContributorsCard: React.FC<
  ResearchOutputContributorsProps
> = ({
  authors,
  onChangeAuthors = noop,
  getAuthorSuggestions = noop,
  labs,
  onChangeLabs = noop,
  getLabSuggestions = noop,
  teams,
  getTeamSuggestions = noop,
  onChangeTeams = noop,
  isSaving,
  isEditMode,
  authorsRequired,
}) => (
  <FormCard title="Who were the contributors?">
    <LabeledMultiSelect
      title="Teams"
      description="Add other teams that contributed to this output. Each author and each lab's Lead PI must have one team listed. Those teams will also then be able to edit."
      subtitle="(required)"
      required
      enabled={!isSaving || !isEditMode}
      placeholder="Start typing..."
      loadOptions={getTeamSuggestions}
      onChange={onChangeTeams as MultiSelectOnChange<MultiSelectOptionsType>}
      values={teams as OptionsType<MultiSelectOptionsType>}
      noOptionsMessage={({ inputValue }) =>
        `Sorry, no teams match ${inputValue}`
      }
    />
    <AuthorSelect
      title="Authors"
      description="Add the contributing authors. Each author must have one of their teams listed in the Teams field."
      subtitle={authorsRequired ? '(required)' : '(optional)'}
      enabled={!isSaving}
      placeholder="Start typing..."
      loadOptions={getAuthorSuggestions}
      onChange={onChangeAuthors}
      values={authors}
      required={authorsRequired}
      noOptionsMessage={({ inputValue }) =>
        `Sorry, no authors match ${inputValue}`
      }
    />
    <LabeledMultiSelect
      title="Labs"
      description="Add ASAP labs that contributed to this output. The Lead PI of each lab must have one of their teams listed in the Teams field. Only labs with ASAP registered PI's will appear."
      subtitle="(optional)"
      enabled={!isSaving}
      placeholder="Start typing..."
      loadOptions={getLabSuggestions}
      onChange={onChangeLabs as MultiSelectOnChange<MultiSelectOptionsType>}
      values={labs as OptionsType<MultiSelectOptionsType>}
      noOptionsMessage={({ inputValue }) =>
        `Sorry, no labs match ${inputValue}`
      }
    />
  </FormCard>
);
export default ResearchOutputContributorsCard;
