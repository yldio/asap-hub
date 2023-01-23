import { FilterPills } from '@asap-hub/gp2-components';

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
  onRemove: (value: any) => alert(`${value.label} erased!`),
};

export const Normal = () => <FilterPills {...props}></FilterPills>;
