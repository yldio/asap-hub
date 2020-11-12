import React, { ComponentProps } from 'react';
import { date, text, array, select } from '@storybook/addon-knobs';
import {
  ProfileAbout,
  ProfileOutputs,
  ProfilePage,
  ProfileResearch,
  ProfileStaff,
} from '@asap-hub/react-components';
import { TeamRole } from '@asap-hub/model';

import { LayoutDecorator } from './layout';
import { makeFlagDecorator } from './flags';

export default {
  title: 'Pages / Profile',
  decorators: [
    LayoutDecorator,
    makeFlagDecorator('Enable Profile Editing', 'PROFILE_EDITING'),
  ],
};

const commonProps = (): Omit<
  ComponentProps<typeof ProfilePage>,
  'children'
> => ({
  department: text('Department', 'Biology Department'),
  displayName: text('Display Name', 'Phillip Mars, PhD'),
  institution: text('Institution', 'Yale University'),
  lastModifiedDate: new Date(
    date('Last modified', new Date(2020, 6, 12, 14, 32)),
  ).toISOString(),
  firstName: text('First Name', 'Phillip'),
  lastName: text('Last Name', 'Mars'),
  email: 'test@test.com',
  location: text('Location', 'New Haven, Connecticut'),
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
  jobTitle: text('Job Title', 'Assistant Professor'),
  avatarUrl: text(
    'Avatar URL',
    'https://www.hhmi.org/sites/default/files/styles/epsa_250_250/public/Programs/Investigator/Randy-Schekman-400x400.jpg',
  ),
  role: select('Role', ['Grantee', 'Guest'], 'Grantee'),
  aboutHref: '/wrong',
  researchHref: '/wrong',
  outputsHref: '/wrong',
  discoverHref: '/discover',
});
const commonPropsEditable = (): ReturnType<typeof commonProps> => ({
  ...commonProps(),
  editPersonalInfoHref: '/wrong',
  editContactHref: '/wrong',
});

const researchTabProps = (): ComponentProps<typeof ProfileResearch> => ({
  ...commonProps(),
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

const aboutTabProps = (): ComponentProps<typeof ProfileAbout> => ({
  biography: text(
    'Biography',
    'Dr. Randy Schekman is a Professor in the Department of Molecular and Cell Biology, University of California, and an Investigator of the Howard Hughes Medical Institute. He studied the enzymology of DNA replication as a graduate student with Arthur Kornberg at Stanford University. Among his awards is the Nobel Prize in Physiology or Medicine, which he shared with James Rothman and Thomas Südhof.',
  ),
  orcidWorks: [
    {
      doi: 'https://doi.org/10.7554/elife.07083',
      title:
        'Recognizing the importance of new tools and resources for research',
      type: 'WEBSITE',
      publicationDate: {
        year: '2015',
        month: '3',
      },
      lastModifiedDate: '1478865224685',
    },
  ],
});

export const ResearchTabViewOnly = () => (
  <ProfilePage {...commonProps()} researchHref="#">
    <ProfileResearch {...researchTabProps()} />
  </ProfilePage>
);
export const ResearchTabEditable = () => (
  <ProfilePage {...commonPropsEditable()} researchHref="#">
    <ProfileResearch
      {...researchTabProps()}
      editBackgroundHref="/wrong"
      editSkillsHref="/wrong"
      editQuestionsHref="/wrong"
    />
  </ProfilePage>
);

export const AboutTabViewOnly = () => (
  <ProfilePage {...commonProps()} aboutHref="#">
    <ProfileAbout {...aboutTabProps()} />
  </ProfilePage>
);
export const AboutTabEditable = () => (
  <ProfilePage {...commonPropsEditable()} aboutHref="#">
    <ProfileAbout
      {...aboutTabProps()}
      editBiographyHref="/wrong"
      editOrcidWorksHref="/wrong"
    />
  </ProfilePage>
);

export const OutputsTab = () => (
  <ProfilePage {...commonProps()} outputsHref="#">
    <ProfileOutputs />
  </ProfilePage>
);

export const StaffTab = () => (
  <ProfilePage {...commonProps()} role="Staff" aboutHref="#">
    <ProfileStaff
      {...commonProps()}
      {...researchTabProps()}
      {...aboutTabProps()}
    />
  </ProfilePage>
);
