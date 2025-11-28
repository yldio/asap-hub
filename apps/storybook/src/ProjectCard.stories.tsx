import { ProjectCard } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Projects / Project Card',
  component: ProjectCard,
};

// Discovery Project Examples

export const DiscoveryProjectActive = () => (
  <ProjectCard
    projectType="Discovery Project"
    id="discovery-1"
    title="Understanding Genetic Mechanisms in Parkinson's Disease"
    status="Active"
    researchTheme="Genetics"
    teamName="Alpha Team"
    teamId="team-1"
    startDate="2023-01-01"
    endDate="2025-12-31"
    duration="3 yrs"
    tags={[
      'Genomics',
      'LRRK2',
      'Alpha-synuclein',
      'Mitochondrial dysfunction',
      'Neurodegeneration',
    ]}
  />
);

export const DiscoveryProjectComplete = () => (
  <ProjectCard
    projectType="Discovery Project"
    id="discovery-2"
    title="Biomarker Development for Early Parkinson's Detection"
    status="Completed"
    researchTheme="Biomarkers"
    teamName="Chen Discovery Team"
    teamId="team-2"
    startDate="2021-03-01"
    endDate="2024-02-28"
    duration="3 yrs"
    tags={['CSF Analysis', 'Imaging', 'Proteomics']}
  />
);

export const DiscoveryProjectClosed = () => (
  <ProjectCard
    projectType="Discovery Project"
    id="discovery-3"
    title="Exploring Environmental Factors in PD Progression"
    status="Closed"
    researchTheme="Environmental Factors"
    teamName="Roberts Lab"
    startDate="2020-06-01"
    endDate="2022-05-31"
    duration="2 yrs"
    tags={['Pesticides', 'Environmental toxins', 'Epidemiology']}
  />
);

// Resource Project Examples

export const ResourceProjectActiveTeamBased = () => (
  <ProjectCard
    projectType="Resource Project"
    id="resource-1"
    title="Comprehensive Parkinson's Disease Biobank"
    status="Active"
    resourceType="Biobank"
    isTeamBased={true}
    teamName="Anderson Resource Team"
    teamId="team-3"
    startDate="2022-09-01"
    endDate="2026-08-31"
    duration="4 yrs"
    tags={['Tissue samples', 'DNA', 'RNA', 'Plasma']}
    googleDriveLink="https://drive.google.com/example"
  />
);

export const ResourceProjectActiveMemberBased = () => (
  <ProjectCard
    projectType="Resource Project"
    id="resource-2"
    title="Open-Source Analysis Pipeline for PD Genomics"
    status="Active"
    resourceType="Software Tool"
    isTeamBased={false}
    members={[
      {
        id: '1',
        displayName: 'Dr. Sarah Johnson',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@example.com',
        href: '/users/1',
      },
      {
        id: '2',
        displayName: 'Dr. Michael Chen',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.c@example.com',
        href: '/users/2',
      },
      {
        id: '3',
        displayName: 'Dr. Emily Rodriguez',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.r@example.com',
        href: '/users/3',
      },
      {
        id: '4',
        displayName: 'Dr. James Wilson',
        firstName: 'James',
        lastName: 'Wilson',
        email: 'james.w@example.com',
        href: '/users/4',
      },
    ]}
    startDate="2023-01-01"
    endDate="2024-06-30"
    duration="18 mos"
    tags={['Bioinformatics', 'Open source', 'Python', 'R']}
    googleDriveLink="https://drive.google.com/example"
  />
);

export const ResourceProjectComplete = () => (
  <ProjectCard
    projectType="Resource Project"
    id="resource-3"
    title="Standardized Clinical Assessment Protocol"
    status="Completed"
    resourceType="Protocol"
    isTeamBased={true}
    teamName="Williams Clinical Team"
    teamId="team-4"
    startDate="2021-04-01"
    endDate="2023-03-31"
    duration="2 yrs"
    tags={['Clinical assessment', 'MDS-UPDRS', 'Standardization']}
  />
);

export const ResourceProjectClosed = () => (
  <ProjectCard
    projectType="Resource Project"
    id="resource-4"
    title="Automated Brain Imaging Analysis Tool"
    status="Closed"
    resourceType="Software"
    isTeamBased={false}
    members={[
      {
        id: '5',
        displayName: 'Dr. Lisa Kumar',
        firstName: 'Lisa',
        lastName: 'Kumar',
        email: 'lisa.k@example.com',
        href: '/users/5',
      },
      {
        id: '6',
        displayName: 'Dr. Robert Taylor',
        firstName: 'Robert',
        lastName: 'Taylor',
        email: 'robert.t@example.com',
        href: '/users/6',
      },
    ]}
    startDate="2019-10-01"
    endDate="2021-09-30"
    duration="2 yrs"
    tags={['MRI', 'Machine learning', 'Neuroimaging']}
  />
);

// Trainee Project Examples

export const TraineeProjectActive = () => (
  <ProjectCard
    projectType="Trainee Project"
    id="trainee-1"
    title="Investigating Alpha-Synuclein Aggregation in Cell Models"
    status="Active"
    trainer={{
      id: '7',
      displayName: 'Dr. Amanda Foster',
      firstName: 'Amanda',
      lastName: 'Foster',
      email: 'amanda.f@example.com',
      href: '/users/7',
    }}
    members={[
      {
        id: '8',
        displayName: 'Prof. David Martinez',
        firstName: 'David',
        lastName: 'Martinez',
        email: 'david.m@example.com',
        href: '/users/8',
      },
    ]}
    startDate="2023-07-01"
    endDate="2025-06-30"
    duration="2 yrs"
    tags={['Cell biology', 'Protein aggregation', 'iPSC models']}
  />
);

export const TraineeProjectComplete = () => (
  <ProjectCard
    projectType="Trainee Project"
    id="trainee-2"
    title="Dopaminergic Neuron Vulnerability in Parkinson's Disease"
    status="Completed"
    trainer={{
      id: '10',
      displayName: 'Prof. Maria Gonzalez',
      firstName: 'Maria',
      lastName: 'Gonzalez',
      email: 'maria.g@example.com',
      href: '/users/10',
    }}
    members={[
      {
        id: '9',
        displayName: 'Dr. Kevin Patel',
        firstName: 'Kevin',
        lastName: 'Patel',
        email: 'kevin.p@example.com',
        href: '/users/9',
      },
      {
        id: '11',
        displayName: 'Dr. Thomas Lee',
        firstName: 'Thomas',
        lastName: 'Lee',
        email: 'thomas.l@example.com',
        href: '/users/11',
      },
    ]}
    startDate="2022-01-01"
    endDate="2023-12-31"
    duration="2 yrs"
    tags={['Neuroscience', 'Electrophysiology', 'Mitochondria']}
  />
);

export const TraineeProjectClosed = () => (
  <ProjectCard
    projectType="Trainee Project"
    id="trainee-3"
    title="Role of Inflammation in Parkinson's Progression"
    status="Closed"
    trainer={{
      id: '12',
      displayName: 'Dr. Sophie Anderson',
      firstName: 'Sophie',
      lastName: 'Anderson',
      email: 'sophie.a@example.com',
      href: '/users/12',
    }}
    members={[
      {
        id: '13',
        displayName: 'Dr. Rachel Kim',
        firstName: 'Rachel',
        lastName: 'Kim',
        email: 'rachel.k@example.com',
        href: '/users/13',
      },
    ]}
    startDate="2020-09-01"
    endDate="2021-08-31"
    duration="1 yr"
    tags={['Neuroinflammation', 'Microglia', 'Cytokines']}
  />
);

// Mixed Display for Comparison

export const AllProjectTypesActive = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <DiscoveryProjectActive />
    <ResourceProjectActiveTeamBased />
    <TraineeProjectActive />
  </div>
);

export const AllStatusTypes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <DiscoveryProjectActive />
    <DiscoveryProjectComplete />
    <DiscoveryProjectClosed />
  </div>
);
