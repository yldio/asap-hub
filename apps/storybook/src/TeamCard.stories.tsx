import { number, text } from './knobs';

import { TeamCard } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Network / Team Card',
};

const expertiseAndResource = 'Neurological Diseases';

const teamCardProps = () => {
  const numberOfExpertiseAndResources = number(
    'Number of expertise and resources',
    8,
    {
      min: 0,
    },
  );
  const numberOfMembers = number('Number of team members', 3, { min: 0 });
  return {
    id: 'ee98d044-79a7-4028-915d-7f88793e3190',
    displayName: text('Display Name', 'Barnes, A.'),
    projectTitle:
      'Caczis lu ugez fotsilaz ijmomi uliruti lerohe ji godmiw suuzu imatorok vuk nubozo eveoluf hec sacme sevce wizlec.',

    tags: [
      ...Array(numberOfExpertiseAndResources).fill(
        expertiseAndResource,
        0,
        numberOfExpertiseAndResources,
      ),
    ],
    memberCount: numberOfMembers,
    labCount: number('Lab count', 15),
  };
};

export const Normal = () => <TeamCard {...teamCardProps()} />;
