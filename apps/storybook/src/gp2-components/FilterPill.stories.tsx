import { FilterPill } from '@asap-hub/gp2-components';
import { ValueProps } from '@asap-hub/gp2-components/src/molecules/FilterPill';

export default {
  title: 'GP2 / Molecules / Filter Pill',
  component: FilterPill,
};

const props = {
  value: {
    id: 'region-Africa',
    label: 'Africa',
  },
  onRemove: (value: ValueProps) => alert(`${value.label} erased!`),
};

export const Normal = () => <FilterPill {...props}></FilterPill>;
