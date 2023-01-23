import { FilterPills } from '@asap-hub/gp2-components';
import { ValueProps } from '@asap-hub/gp2-components/src/molecules/FilterPill';

export default {
  title: 'GP2 / Organisms / Filter Pills',
  component: FilterPills,
};

const props = {
  values: [
    {
      id: 'region-Africa',
      label: 'Africa',
    },
    {
      id: 'region-Asia',
      label: 'Asia',
    },
  ],
  onRemove: (value: ValueProps) => alert(`${value.label} erased!`),
};

export const Normal = () => <FilterPills {...props}></FilterPills>;
