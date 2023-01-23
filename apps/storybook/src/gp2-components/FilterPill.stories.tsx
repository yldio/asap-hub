import { FilterPill } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Molecules / Filter Pill',
  component: FilterPill,
};

const props = {
  value: {
    id: 'region-Africa',
    label: 'Africa',
  },
  onRemove: (value: any) => alert(`${value.label} erased!`),
};

export const Normal = () => <FilterPill {...props}></FilterPill>;
