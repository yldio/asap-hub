import { ComponentProps } from 'react';
import { UserProfileResearch } from '@asap-hub/react-components';
import { array, text, boolean, select } from '@storybook/addon-knobs';
import { TeamRole } from '@asap-hub/model';

export default {
  title: 'Templates / User Profile / Research',
  component: UserProfileResearch,
};

const props = (): ComponentProps<typeof UserProfileResearch> => ({
  displayName: text('Display Name', 'Phillip Mars, PhD'),
  firstName: text('First Name', 'Phillip'),
  email: text('Email', 'me@example.com'),
  contactEmail: text('Contact email', 'contact@example.com'),
  labs: [],
  teams: [
    {
      id: '42',
      role: text('Role', 'Researcher') as TeamRole,
      displayName: text('Team Name', 'Ferguson, M'),
    },
  ],
  expertiseAndResourceTags: array('Expertise and Resources', [
    'Neurological Diseases',
    'Clinical Neurology',
    'Adult Neurology',
    'Neuroimaging',
    'Neurologic Examination',
    'Neuroprotection',
    'Movement Disorders',
    'Neurodegenerative Diseases',
    'Neurological Diseases',
  ]),
  questions: array('Questions', [
    'What is the meaning of life?',
    'Are alpha-synuclein deposits the cause or consequence of somethign deeper wrong with neurons?',
    'How much do we have to knock down extracellular alpha-synuclein to measurably slow cell to cell transmission?',
  ]),
  userProfileGroupsCard: boolean('User Profile Groups Placeholder', true)
    ? 'User Profile Groups Placeholder'
    : undefined,
  isOwnProfile: boolean(`Is own profile`, false),
  role: select('ASAP Hub Role', ['Staff', 'Grantee', 'Guest'], 'Grantee'),
});

export const ViewOnly = () => <UserProfileResearch {...props()} />;
export const Editable = () => (
  <UserProfileResearch
    {...props()}
    editExpertiseAndResourcesHref="#edit-expertise-and-resources"
    editQuestionsHref="#edit-questions"
    teams={props().teams.map((team) => ({
      ...team,
      editHref: `#edit-team-membership-${team.id}`,
    }))}
  />
);
