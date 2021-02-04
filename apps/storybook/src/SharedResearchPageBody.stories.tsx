import React, { ComponentProps } from 'react';
import { SharedResearchPageBody } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Shared Research / Page Body',
};

const researchOutput: Omit<
  ComponentProps<typeof SharedResearchPageBody>['researchOutputs'][0],
  'id'
> = {
  type: 'Proposal',
  title:
    'Molecular actions of PD-associated pathological proteins using in vitro human pluripotent stem cell-derived brain organoids',
  created: new Date().toISOString(),
  team: {
    id: '123',
    displayName: 'A Barnes',
    href: '#',
  },
  href: '#',
};

const props = (): ComponentProps<typeof SharedResearchPageBody> => {
  const numberOfItems = number('Number of Outputs', 2, { min: 0 });
  const currentPageIndex = number('Current Page', 1, { min: 1 }) - 1;
  return {
    researchOutputs: Array.from({ length: numberOfItems }, (_, i) => ({
      ...researchOutput,
      id: `ro${i}`,
    })).slice(currentPageIndex * 10, currentPageIndex * 10 + 10),
    numberOfItems,
    numberOfPages: Math.max(1, Math.ceil(numberOfItems / 10)),
    currentPageIndex,
    renderPageHref: (index) => `#${index}`,
  };
};

export const Normal = () => <SharedResearchPageBody {...props()} />;
