import React from 'react';
import { date, text, array } from '@storybook/addon-knobs';
import { ProfilePage, ProfileAbout } from '@asap-hub/react-components';

import { LayoutDecorator } from './decorators';

export default {
  title: 'Pages / Profile',
  decorators: [LayoutDecorator],
};

const commonProps = () => ({
  department: text('Department', 'Biology Department'),
  displayName: text('Display Name', 'Phillip Mars, PhD'),
  institution: text('Institution', 'Yale University'),
  lastModifiedDate: new Date(
    date('Last modified', new Date(2020, 6, 12, 14, 32)),
  ).toISOString(),
  orcidLastModifiedDate: new Date(
    date('Orcid last modified', new Date(2020, 6, 12, 14, 32)),
  ).toISOString(),
  firstName: text('First Name', 'Phillip'),
  lastName: text('Last Name', 'Mars'),
  location: text('Location', 'New Haven, Connecticut'),
  teams: [
    {
      id: '42',
      role: text('Role', 'Researcher'),
      displayName: text('Team Name', 'Ferguson, M'),
      approach: text(
        'Approach',
        'As an expert in MRI scans, Tess will leverage past experience to lead the team to define the next big thing in MRI scans and keep the budget on track. We will first quantify the motor function of A53T human α-synuclein Tg mice and age-matched non-transgenic littermates using a modified open field test. To evaluate whether changes of dynein were related to α-synuclein aggregation, double immunostaining for α-synuclein and dynein will be performed. Finally, an analysis of the correlation between motor behaviors and the protein level of dynein in the striatum will be conducted.',
      ),
      responsabilities: text(
        'Responsabilities',
        "Phillip's team wants to understand how A53T-alpha-synuclein affects synapse structure/ function and identify possible correlation between its neurotoxicity and specific neuronal subtypes.",
      ),
    },
  ],
  jobTitle: text('Job Title', 'Assistant Professor'),
  avatarURL: text(
    'Avatar URL',
    'https://www.hhmi.org/sites/default/files/styles/epsa_250_250/public/Programs/Investigator/Randy-Schekman-400x400.jpg',
  ),
  skills: [],
  orcidWorks: [
    {
      id: '42',
      doi: 'https://doi.org/10.7554/elife.07083',
      title:
        'Recognizing the importance of new tools and resources for research',
      type: 'UNDEFINED' as const,
      publicationDate: {
        year: '2015',
        month: '05',
      },
    },
  ],
  aboutHref: '/wrong',
  researchInterestsHref: '/wrong',
  outputsHref: '/wrong',
});

export const AboutTab = () => (
  <ProfilePage {...commonProps()} aboutHref="#">
    <ProfileAbout
      biography={text(
        'Biography',
        'Dr. Randy Schekman is a Professor in the Department of Molecular and Cell Biology, University of California, and an Investigator of the Howard Hughes Medical Institute. He studied the enzymology of DNA replication as a graduate student with Arthur Kornberg at Stanford University. Among his awards is the Nobel Prize in Physiology or Medicine, which he shared with James Rothman and Thomas Südhof.',
      )}
      skills={array('Skills', [
        'Neurological Diseases',
        'Clinical Neurology',
        'Adult Neurology',
        'Neuroimaging',
        'Neurologic Examination',
        'Neuroprotection',
        'Movement Disorders',
        'Neurodegenerative Diseases',
        'Neurological Diseases',
      ])}
      orcidWorks={[
        {
          id: '42',
          doi: 'https://doi.org/10.7554/elife.07083',
          title:
            'Recognizing the importance of new tools and resources for research',
          type: 'WEBSITE',
          publicationDate: {
            year: '2015',
            month: '3',
          },
        },
      ]}
    />
  </ProfilePage>
);

export const ResearchInterestsTab = () => (
  <ProfilePage {...commonProps()} researchInterestsHref="#">
    Research Interests Tab
  </ProfilePage>
);

export const OutputsTab = () => (
  <ProfilePage {...commonProps()} outputsHref="#">
    Outputs Tab
  </ProfilePage>
);
