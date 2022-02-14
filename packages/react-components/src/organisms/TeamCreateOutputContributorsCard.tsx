import { ComplexValuesMultiSelecletProps } from '../atoms/MultiSelect';
import { FormCard, LabeledMultiSelect } from '../molecules';
import { noop } from '../utils';

type TeamCreateOutputContributorsProps = Pick<
  ComplexValuesMultiSelecletProps,
  'suggestions' | 'values' | 'onChange'
>;

const TeamCreateOutputContributorsCard: React.FC<TeamCreateOutputContributorsProps> =
  ({ onChange = noop, values, suggestions }) => (
    <FormCard title="Who were the contributors?">
      <LabeledMultiSelect
        title="Labs"
        description="Add labs that contributed to this output. Only labs whose PI is part of the CRN will appear."
        subtitle="(optional)"
        suggestions={suggestions}
        placeholder="Start typing..."
        values={values}
        onChange={onChange}
        isSimple={false}
      />
    </FormCard>
  );

export default TeamCreateOutputContributorsCard;
