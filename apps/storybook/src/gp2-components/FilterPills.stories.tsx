import { FilterPills } from '@asap-hub/gp2-components';
import { noop } from '@asap-hub/react-components';
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
  onRemove: noop,
};

export const Normal = () => <FilterPills {...props}></FilterPills>;
