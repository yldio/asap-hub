import AsyncMultiSelect, {
  AsyncMultiSelectProps,
} from '../atoms/AsyncMultiSelect';

import { FormCard } from '../molecules';
import { noop } from '../utils';

type TeamCreateOutputContributorsProps = Pick<
  AsyncMultiSelectProps,
  'values' | 'onChange' | 'loadOptions'
>;

const TeamCreateOutputContributorsCard: React.FC<TeamCreateOutputContributorsProps> =
  ({ onChange = noop, values, loadOptions }) => {
    return (
      <FormCard title="Who were the contributors?">
        <AsyncMultiSelect
          loadOptions={loadOptions}
          onChange={onChange}
          values={values}
        />
      </FormCard>
    );
  };

export default TeamCreateOutputContributorsCard;
