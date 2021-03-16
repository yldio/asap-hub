import React, { ComponentProps } from 'react';
import { UserProfileStaff } from '@asap-hub/react-components';
import { text, array } from '@storybook/addon-knobs';

export default {
  title: 'Templates / User Profile / Staff',
  component: UserProfileStaff,
};

const props = (): ComponentProps<typeof UserProfileStaff> => ({
  firstName: text('First Name', 'Phillip'),
  email: text('Email', 'me@example.com'),
  teams: [],
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

export const Normal = () => <UserProfileStaff {...props()} />;
