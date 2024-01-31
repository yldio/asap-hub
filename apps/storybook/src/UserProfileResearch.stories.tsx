import { ComponentProps } from 'react';
import { UserProfileResearch, Card } from '@asap-hub/react-components';
import { array, text, boolean, select } from '@storybook/addon-knobs';

export default {
  title: 'Templates / User Profile / Research',
  component: UserProfileResearch,
};

const props = (): ComponentProps<typeof UserProfileResearch> => ({
  displayName: text('Display Name', 'Phillip Mars, PhD'),
  firstName: text('First Name', 'Phillip'),
  email: text('Email', 'me@example.com'),
  contactEmail: text('Contact email', 'contact@example.com'),
  researchInterests: 'My Research interests',
  responsibilities: 'My responsibilities',
  reachOut: 'If you need my help',
  tags: array('Expertise and Resources', [
    'Neurological Diseases',
    'Clinical Neurology',
    'Adult Neurology',
    'Neuroimaging',
    'Neurologic Examination',
    'Neuroprotection',
    'Movement Disorders',
    'Neurodegenerative Diseases',
    'Neurological Diseases',
  ]).map((tag) => ({ name: tag, id: 'tag' })),
  questions: array('Questions', [
    'What is the meaning of life?',
    'Are alpha-synuclein deposits the cause or consequence of somethign deeper wrong with neurons?',
    'How much do we have to knock down extracellular alpha-synuclein to measurably slow cell to cell transmission?',
  ]),
  userProfileGroupsCard: boolean('User Profile Groups Placeholder', true) ? (
    <Card>User Profile Groups Placeholder</Card>
  ) : undefined,
  userProfileTeamsCard: boolean('User Profile Teams Placeholder', true) ? (
    <Card>User Profile Teams Placeholder</Card>
  ) : undefined,
  isOwnProfile: boolean(`Is own profile`, false),
  role: select('ASAP Hub Role', ['Staff', 'Grantee', 'Guest'], 'Grantee'),
});

export const ViewOnly = () => <UserProfileResearch {...props()} />;
export const Editable = () => (
  <UserProfileResearch
    {...props()}
    editExpertiseAndResourcesHref="#edit-expertise-and-resources"
    editQuestionsHref="#edit-questions"
    editRoleHref="#edit-role"
  />
);
