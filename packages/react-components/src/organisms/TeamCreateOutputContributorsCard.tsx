import { ComponentPropsWithRef } from 'react';

import { FormCard, LabeledMultiSelect } from '../molecules';
import { noop } from '../utils';

type TeamCreateOutputContributorsProps = {
  readonly labs: ComponentPropsWithRef<typeof LabeledMultiSelect>['values'];
  readonly getLabSuggestions?: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['loadOptions'];
  readonly onChangeLabs?: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['onChange'];

  readonly authors: ComponentPropsWithRef<typeof LabeledMultiSelect>['values'];
  readonly getAuthorSuggestions?: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['loadOptions'];
  readonly onChangeAuthors?: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['onChange'];

  readonly teams: ComponentPropsWithRef<typeof LabeledMultiSelect>['values'];
  readonly getTeamSuggestions?: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['loadOptions'];
  readonly onChangeTeams?: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['onChange'];

  readonly isSaving: boolean;
};

const TeamCreateOutputContributorsCard: React.FC<TeamCreateOutputContributorsProps> =
  ({
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
  }) => (
    <FormCard title="Who were the contributors?">
      <LabeledMultiSelect
        title="Teams"
        description="Add other teams that contributed to this output. Those teams will also then be able to edit."
        subtitle="(required)"
        enabled={!isSaving}
        placeholder="Start typing..."
        loadOptions={getTeamSuggestions}
        onChange={onChangeTeams}
        values={teams}
        noOptionsMessage={({ inputValue }) =>
          `Sorry, no teams match ${inputValue}`
        }
      />
      <LabeledMultiSelect
        title="Labs"
        description="Add labs that contributed to this output. Only labs whose PI is part of the CRN will appear."
        subtitle="(optional)"
        enabled={!isSaving}
        placeholder="Start typing..."
        loadOptions={getLabSuggestions}
        onChange={onChangeLabs}
        values={labs}
        noOptionsMessage={({ inputValue }) =>
          `Sorry, no labs match ${inputValue}`
        }
      />
      <LabeledMultiSelect
        title="Authors"
        description=""
        subtitle="(optional)"
        enabled={!isSaving}
        icons={true}
        placeholder="Start typing..."
        loadOptions={getAuthorSuggestions}
        onChange={onChangeAuthors}
        values={authors}
        noOptionsMessage={({ inputValue }) =>
          `Sorry, no authors match ${inputValue}`
        }
      />
    </FormCard>
  );
export default TeamCreateOutputContributorsCard;
