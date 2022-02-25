import { ComponentPropsWithRef } from 'react';

import { FormCard, LabeledMultiSelect } from '../molecules';
import { noop } from '../utils';

type TeamCreateOutputContributorsProps = {
  labSuggestions: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['loadOptions'];
  readonly labs: ComponentPropsWithRef<typeof LabeledMultiSelect>['values'];
  readonly onChangeLabs: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['onChange'];
  readonly isSaving: boolean;
};

const TeamCreateOutputContributorsCard: React.FC<TeamCreateOutputContributorsProps> =
  ({ onChangeLabs = noop, labs, labSuggestions, isSaving }) => (
    <FormCard title="Who were the contributors?">
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
