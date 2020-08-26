import React from 'react';
import { formatISO, subDays } from 'date-fns';
import { TeamPage, TeamAbout } from '@asap-hub/react-components';

import { LayoutDecorator } from './decorators';

export default {
  title: 'Pages / Team',
  decorators: [LayoutDecorator],
};

const commonProps = () => ({
  id: '42',
  displayName: 'Ramirez, T',
  projectTitle:
    'Molecular actions of PD-associated pathological proteins using in vitro human pluripotent steam cell brain organoids.',
  projectSummary:
    'This project provides a transformational biological understanding of the cellular mechanisms that converge to cause the degeneration seen in Parkinson’s disease (PD), given the now well-studied genetic landscape [1]. The specific hypothesis addressed by this proposal is that bioenergetic (mitochondrial and mTOR regulation), glycolipid/lipid and neuroimmune abnormalities can converge, resulting in cell dysfunction of neurons, astrocytes and microglia that lead to PD. The current conventional view of the cellular and systemic culprits of PD has not led to any successful drug development. This project is organized into 5 synergistic research components. Each Co-Investigator (Co-I) addresses the central research questions in different human cellular systems (neurons and glia), in vivo models and methodological frameworks. The proposed work will provide new and transformational biological insight by systematically connecting critical cellular, organelle, metabolic, and neuroimmune mechanisms that converge in unique and specific intercellular pathways to cause the degeneration leading to PD. These critical experiments and analyses proposed will have a high and lasting impact on development of new PD therapeutics. Without this kind of comprehensive study by several teams working together, siloed information, such as protein aggregation, mitochondrial failure, autophagy, mTOR/lysosomal abnormalities and lipid stress will remain as detailed but incomplete and disconnected narratives, not reflecting what actually causes PD in individual patients with age.',
  applicationNumber: 'Unknnow',
  lastModifiedDate: formatISO(subDays(new Date(), 2)),
  skills: [],
  members: [
    {
      id: '1',
      displayName: 'Daniel Ramirez',
      firstName: 'Daniel',
      lastName: 'Ramirez',
      role: 'Principal Investigator',
    },
    {
      id: '2',
      displayName: 'Peter Venkman',
      firstName: 'Peter',
      lastName: 'Venkman',
      role: 'Project Manager',
    },
    {
      id: '3',
      displayName: 'Tess W. B. Goetz',
      firstName: 'Tess',
      lastName: 'Goetz',
      role: 'Collaborator',
    },
    {
      id: '4',
      displayName: 'Robin Peploe',
      firstName: 'Robin',
      lastName: 'Peploe',
      role: 'Collaborator',
    },
    {
      id: '5',
      displayName: 'Alice Lane',
      firstName: 'Alice',
      lastName: 'Lane',
      role: 'Collaborator',
    },
    {
      id: '6',
      displayName: 'Philip Mars',
      firstName: 'Philip',
      lastName: 'Mars',
      role: 'Collaborator',
    },
    {
      id: '7',
      displayName: 'Emmanuel Depay',
      firstName: 'Emanuel',
      lastName: 'Depay',
      role: 'Collaborator',
    },
  ],
  aboutHref: '/wrong',
  outputsHref: '/wrong',
});

export const AboutTab = () => (
  <TeamPage {...commonProps()} aboutHref="#">
    <TeamAbout {...commonProps()}></TeamAbout>
  </TeamPage>
);

export const OutputsTab = () => <TeamPage {...commonProps()}>Outputs</TeamPage>;
