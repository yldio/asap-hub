import { number, text, boolean } from '@storybook/addon-knobs';

import { TeamCard } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Network / Team Card',
};
const member = {
  id: 'ff0e04ac-4769-44ed-8d3b-245c1bfe17b3',
  firstName: 'Mason',
  lastName: 'Carpenter',
  displayName: 'Birdie Romeo',
  role: 'VrrPdl',
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
    active: boolean('Is the team active?', true),
    projectTitle:
      'Caczis lu ugez fotsilaz ijmomi uliruti lerohe ji godmiw suuzu imatorok vuk nubozo eveoluf hec sacme sevce wizlec.',

    projectSummary: text(
      'Project Summary',
      'Molecular actions of PD-associated pathological proteins using in vitro human pluripotent stem cell-derived brain organoids',
    ),
    expertiseAndResourceTags: [
      ...Array(numberOfExpertiseAndResources).fill(
        expertiseAndResource,
        0,
        numberOfExpertiseAndResources,
      ),
    ],
    members: [...Array(numberOfMembers).fill(member, 0, numberOfMembers)],
    lastModifiedDate: '2020-07-31T11:45:14Z',
    labCount: number('Lab count', 15),
  };
};

export const Normal = () => <TeamCard {...teamCardProps()} />;
