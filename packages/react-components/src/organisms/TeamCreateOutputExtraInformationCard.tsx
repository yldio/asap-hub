import { Link } from '../atoms';
import { FormCard, LabeledMultiSelect } from '../molecules';
import { noop } from '../utils';

type TeamCreateOutputExtraInformationProps = {
  suggestions: string[];
  values: string[];
  onChange?: (values: string[]) => void;
};

const TeamCreateOutputExtraInformationCard: React.FC<TeamCreateOutputExtraInformationProps> =
  ({ onChange = noop, values, suggestions }) => (
    <FormCard title="What extra information can you provide?">
      <LabeledMultiSelect
        title="Additional Keywords"
        description="Increase the discoverability of this output by adding tags."
        subtitle="(optional)"
        suggestions={suggestions}
        placeholder="Add a keyword (E.g. Cell Biology)"
        values={values}
        onChange={onChange}
      />
      <Link href="mailto:techsupport@asap.science?subject=New+keyword">
        Ask ASAP to add a new keyword
      </Link>
    </FormCard>
  );

export default TeamCreateOutputExtraInformationCard;
