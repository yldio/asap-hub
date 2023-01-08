import { ComponentProps } from 'react';
import { NetworkPeople } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';
import { TeamRole, TeamStatus } from '@asap-hub/model';

export default {
  title: 'Templates / Network / People',
  component: NetworkPeople,
};

const peopleProps = (): ComponentProps<typeof NetworkPeople> => {
  const numberOfItems = number('Number of Teams', 2, { min: 0 });
  const currentPageIndex = number('Current Page', 1, { min: 1 }) - 1;
  return {
    people: Array.from({ length: numberOfItems }, (_, i) => ({
      id: `p${i}`,
      createdDate: '2020-09-07T17:36:54Z',
      displayName: `Agnete Kirkeby ${i + 1}`,
      firstName: 'Agnete',
      lastName: 'Kirkeby',
      jobTitle: 'Assistant Professor',
      institution: 'University of Copenhagen',
      teams: [
        {
          id: 't1',
          displayName: 'Jakobsson, J',
          role: 'Co-Investigator' as TeamRole,
          status: 'Active' as TeamStatus,
        },
      ],
      labs: [
        { id: 'cd7be4904', name: 'Manchester' },
        { id: 'cd7be4905', name: 'Glasgow' },
      ],
      role: 'Grantee' as const,
    })).slice(currentPageIndex * 10, currentPageIndex * 10 + 10),
    numberOfItems,
    numberOfPages: Math.max(1, Math.ceil(numberOfItems / 10)),
    currentPageIndex,
    renderPageHref: (index) => `#${index}`,
  };
};

export const Normal = () => <NetworkPeople {...peopleProps()} />;
