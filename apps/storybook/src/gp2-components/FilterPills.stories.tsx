import { FilterPills } from '@asap-hub/gp2-components';
import { ComponentProps } from 'react';

export default {
  title: 'GP2 / Organisms / Filter Pills',
  component: FilterPills,
};

const props: ComponentProps<typeof FilterPills> = {
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
  onRemove: (value) => alert(`${value.label} erased!`),
};

export const Normal = () => <FilterPills {...props}></FilterPills>;
