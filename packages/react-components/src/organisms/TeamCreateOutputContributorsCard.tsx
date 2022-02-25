import { AsyncMultiSelectProps } from '../atoms/AsyncMultiSelect';

import { FormCard, LabeledMultiSelect } from '../molecules';
import { noop } from '../utils';

type TeamCreateOutputContributorsProps = Pick<
  AsyncMultiSelectProps,
  'values' | 'onChange' | 'loadOptions'
> & {
  readonly isSaving: boolean;
};

const TeamCreateOutputContributorsCard: React.FC<TeamCreateOutputContributorsProps> =
  ({ onChange = noop, values, loadOptions, isSaving }) => (
    <FormCard title="Who were the contributors?">
      <LabeledMultiSelect
        title="Labs"
        description="Add labs that contributed to this output. Only labs whose PI is part of the CRN will appear."
        subtitle="(optional)"
        enabled={!isSaving}
        placeholder="Start typing..."
        loadOptions={loadOptions}
        onChange={(options) => onChange(options.map(({ value }) => value))}
        values={values}
        noOptionsMessage={({ inputValue }: { inputValue: string }) =>
          `Sorry, no labs match ${inputValue}`
        }
      />
    </FormCard>
  );
export default TeamCreateOutputContributorsCard;
