import React, { ComponentProps } from 'react';
import { date, text, array, select } from '@storybook/addon-knobs';
import {
  UserProfileAbout,
  UserProfileOutputs,
  UserProfilePage,
  UserProfileResearch,
  UserProfileStaff,
  BiographyModal,
  PersonalInfoModal,
  ContactInfoModal,
  TeamMembershipModal,
  OpenQuestionsModal,
} from '@asap-hub/react-components';
import { TeamRole } from '@asap-hub/model';

import { LayoutDecorator } from './layout';
import { makeFlagDecorator } from './flags';

export default {
  title: 'Pages / User Profile',
  decorators: [
    LayoutDecorator,
    makeFlagDecorator('Enable Works Visibility Editing', 'EDIT_PROFILE_WORKS'),
    makeFlagDecorator('Enable Skills Editing', 'EDIT_PROFILE_SKILLS'),
    makeFlagDecorator('Enable Questions Editing', 'EDIT_PROFILE_QUESTIONS'),
    makeFlagDecorator('Enable Other Editing', 'EDIT_PROFILE_REST'),
  ],
};

const commonProps = (): Omit<
  ComponentProps<typeof UserProfilePage>,
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
  email: text('Email', 'me@example.com'),
  contactEmail: text('Contact email', 'contact@example.com'),
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
  social: {
    twitter: text('Twitter Handle', '123'),
    github: text('Github Handle', '123'),
    googleScholar: text('Google Scholar', '123'),
    linkedIn: text('Linkedin', '123'),
    orcid: text('Orcid Id', '123'),
    researchGate: text('Research Gate', '123'),
    researcherId: text('Researcher Id', '123'),
  },
  aboutHref: '/wrong',
  researchHref: '/wrong',
  outputsHref: '/wrong',
  discoverHref: '/discover',
});
const commonPropsEditable = (): ReturnType<typeof commonProps> => ({
  ...commonProps(),
  editPersonalInfoHref: '/wrong',
  editContactInfoHref: '/wrong',
});

const researchTabProps = (): ComponentProps<typeof UserProfileResearch> => ({
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

const aboutTabProps = (): ComponentProps<typeof UserProfileAbout> => ({
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
  <UserProfilePage {...commonProps()} researchHref="#">
    <UserProfileResearch {...researchTabProps()} />
  </UserProfilePage>
);

export const ResearchTabTeamMembershipModal = () => (
  <UserProfilePage {...commonProps()} researchHref="#">
    <UserProfileResearch {...researchTabProps()} />
    <TeamMembershipModal backHref="#" {...researchTabProps().teams[0]} />
  </UserProfilePage>
);

export const ResearchTabOpenQuestionsModal = () => (
  <UserProfilePage {...commonProps()} researchHref="#">
    <UserProfileResearch {...researchTabProps()} />
    <OpenQuestionsModal backHref="#" {...researchTabProps()} />
  </UserProfilePage>
);
export const ResearchTabEditable = () => (
  <UserProfilePage {...commonPropsEditable()} researchHref="#">
    <UserProfileResearch
      {...researchTabProps()}
      teams={commonProps().teams.map((team) => ({
        ...team,
        editHref: `/edit-team-membership/${team.id}`,
      }))}
      editSkillsHref="/wrong"
      editQuestionsHref="/wrong"
    />
  </UserProfilePage>
);

export const AboutTabViewOnly = () => (
  <UserProfilePage {...commonProps()} aboutHref="#">
    <UserProfileAbout {...aboutTabProps()} />
  </UserProfilePage>
);
export const AboutTabEditable = () => (
  <UserProfilePage {...commonPropsEditable()} aboutHref="#">
    <UserProfileAbout
      {...aboutTabProps()}
      editBiographyHref="/wrong"
      editOrcidWorksHref="/wrong"
    />
  </UserProfilePage>
);
export const AboutTabEditBiography = () => (
  <UserProfilePage {...commonPropsEditable()} aboutHref="#">
    <UserProfileAbout
      {...aboutTabProps()}
      editBiographyHref="/wrong"
      editOrcidWorksHref="/wrong"
    />
    <BiographyModal biography={aboutTabProps().biography} backHref="#" />
  </UserProfilePage>
);

export const AboutTabEditPersonalInfo = () => (
  <UserProfilePage {...commonPropsEditable()} aboutHref="#">
    <UserProfileAbout
      {...aboutTabProps()}
      editBiographyHref="/wrong"
      editOrcidWorksHref="/wrong"
    />
    <PersonalInfoModal {...aboutTabProps()} backHref="/wrong" />
  </UserProfilePage>
);
export const AboutTabEditContactInfo = () => (
  <UserProfilePage {...commonPropsEditable()} aboutHref="#">
    <UserProfileAbout
      {...aboutTabProps()}
      editBiographyHref="/wrong"
      editOrcidWorksHref="/wrong"
    />
    <ContactInfoModal
      email={commonPropsEditable().contactEmail}
      fallbackEmail={commonPropsEditable().email}
      backHref="/wrong"
    />
  </UserProfilePage>
);

export const OutputsTab = () => (
  <UserProfilePage {...commonProps()} outputsHref="#">
    <UserProfileOutputs />
  </UserProfilePage>
);

export const StaffTab = () => (
  <UserProfilePage {...commonProps()} role="Staff" aboutHref="#">
    <UserProfileStaff
      {...commonProps()}
      {...researchTabProps()}
      {...aboutTabProps()}
    />
  </UserProfilePage>
);
