import { FilterPill } from '@asap-hub/gp2-components';
import { noop } from '@asap-hub/react-components';
import { ComponentProps } from 'react';

export default {
  title: 'GP2 / Molecules / Filter Pill',
  component: FilterPill,
};

const props: ComponentProps<typeof FilterPill> = {
  value: {
    id: '0',
    typeOfFilter: 'regions',
    label: 'Africa',
  },
  onRemove: noop,
};

export const Normal = () => <FilterPill {...props}></FilterPill>;
