import { ComponentPropsWithRef } from 'react';

import { FormCard, LabeledMultiSelect } from '../molecules';
import { noop } from '../utils';

type TeamCreateOutputContributorsProps = {
  labSuggestions: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['loadOptions'];
  readonly labs: ComponentPropsWithRef<typeof LabeledMultiSelect>['values'];
  readonly onChangeLabs?: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['onChange'];
  authorSuggestions: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['loadOptions'];
  readonly authors: ComponentPropsWithRef<typeof LabeledMultiSelect>['values'];
  readonly onChangeAuthors?: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['onChange'];
  readonly isSaving: boolean;
};

const TeamCreateOutputContributorsCard: React.FC<TeamCreateOutputContributorsProps> =
  ({
    onChangeLabs = noop,
    onChangeAuthors = noop,
    labs,
    labSuggestions,
    authors,
    authorSuggestions,
    isSaving,
  }) => (
    <FormCard title="Who were the contributors?">
      <LabeledMultiSelect
        title="Authors"
        description="Add author that contributed to this output. Only authors whose PI is part of the CRN will appear."
        subtitle="(optional)"
        enabled={!isSaving}
        placeholder="Start typing..."
        loadOptions={authorSuggestions}
        onChange={onChangeAuthors}
        values={authors}
        noOptionsMessage={({ inputValue }) =>
          `Sorry, no authors match ${inputValue}`
        }
      />
      <LabeledMultiSelect
        title="Labs"
        description="Add labs that contributed to this output. Only labs whose PI is part of the CRN will appear."
        subtitle="(optional)"
        enabled={!isSaving}
        placeholder="Start typing..."
        loadOptions={labSuggestions}
        onChange={onChangeLabs}
        values={labs}
        noOptionsMessage={({ inputValue }) =>
          `Sorry, no labs match ${inputValue}`
        }
      />
    </FormCard>
  );
export default TeamCreateOutputContributorsCard;
