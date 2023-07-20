import { CardTable } from '@asap-hub/gp2-components';
import { ComponentProps } from 'react';

export default {
  title: 'GP2 / Organisms / Card Table',
  component: CardTable,
};

const props: ComponentProps<typeof CardTable> = {
  headings: ['Name', 'Role', 'Status'],
  children: [
    { id: 'one', values: ['John', 'President', 'Active'] },
    { id: 'two', values: ['Tony', 'Contributor', 'Complete'] },
    { id: 'three', values: ['Bruce', 'Investigator', 'Paused'] },
  ],
};

const onBoardingProps: ComponentProps<typeof CardTable> = {
  headings: ['Name', 'Status'],
  children: [
    { id: 'one', values: ['John', 'Active'] },
    { id: 'two', values: ['Tony', 'Complete'] },
    { id: 'three', values: ['Bruce', 'Paused'] },
  ],
};

export const Normal = () => <CardTable {...props} />;

export const OnBoarding = () => <CardTable {...onBoardingProps} isOnboarding />;
