import React, { ComponentProps } from 'react';
import { UserProfileResearch } from '@asap-hub/react-components';
import { array, text } from '@storybook/addon-knobs';
import { TeamRole } from '@asap-hub/model';
import { makeFlagDecorator } from './flags';

export default {
  title: 'Templates / User Profile / Research',
  component: UserProfileResearch,
  decorators: [
    makeFlagDecorator('Enable Skills Editing', 'USER_PROFILE_EDIT_SKILLS'),
  ],
};

const props = (): ComponentProps<typeof UserProfileResearch> => ({
  displayName: text('Display Name', 'Phillip Mars, PhD'),
  firstName: text('First Name', 'Phillip'),
  email: text('Email', 'me@example.com'),
  contactEmail: text('Contact email', 'contact@example.com'),
  teams: [
    {
      id: '42',
      href: '#42',
      role: text('Role', 'Researcher') as TeamRole,
      displayName: text('Team Name', 'Ferguson, M'),
      approach: text(
        'Approach',
        'As an expert in MRI scans, Tess will leverage past experience to lead the team to define the next big thing in MRI scans and keep the budget on track. We will first quantify the motor function of A53T human α-synuclein Tg mice and age-matched non-transgenic littermates using a modified open field test. To evaluate whether changes of dynein were related to α-synuclein aggregation, double immunostaining for α-synuclein and dynein will be performed. Finally, an analysis of the correlation between motor behaviors and the protein level of dynein in the striatum will be conducted.',
      ),
      responsibilities: text(
        'Responsibilities',
        "Phillip's team wants to understand how A53T-alpha-synuclein affects synapse structure/ function and identify possible correlation between its neurotoxicity and specific neuronal subtypes.",
      ),
    },
  ],
  skills: array('Skills', [
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
});

export const ViewOnly = () => <UserProfileResearch {...props()} />;
export const Editable = () => (
  <UserProfileResearch
    {...props()}
    editSkillsHref="#edit-skills"
    editQuestionsHref="#edit-questions"
    teams={props().teams.map((team) => ({
      ...team,
      editHref: `#edit-team-membership-${team.id}`,
    }))}
  />
);
