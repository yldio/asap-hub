import { CollapsibleTable } from '@asap-hub/gp2-components';
import { ComponentProps } from 'react';

export default {
  title: 'GP2 / Molecules / Collapsible Table',
  component: CollapsibleTable,
};

const props: ComponentProps<typeof CollapsibleTable> = {
  headings: ['Name', 'Role', 'Status'],
  children: [
    { id: 'one', values: ['John', 'President', 'Active'] },
    { id: 'two', values: ['Tony', 'Contributor', 'Complete'] },
    { id: 'three', values: ['Bruce', 'Investigator', 'Paused'] },
  ],
};

export const Normal = () => <CollapsibleTable {...props} />;
