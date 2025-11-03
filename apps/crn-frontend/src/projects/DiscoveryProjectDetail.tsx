import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';
import {
  ProjectDetailPage,
  ProjectDetailAbout,
  NotFoundPage,
} from '@asap-hub/react-components';
import { projects } from '@asap-hub/routing';
import { DiscoveryProjectDetail as DiscoveryProjectDetailType } from '@asap-hub/model';

// Mock data - this would come from API in real implementation
const mockDiscoveryProjectDetail: DiscoveryProjectDetailType = {
  id: '1',
  title: 'Alpha-Synuclein Aggregation Mechanisms',
  status: 'Active',
  projectType: 'Discovery',
  researchTheme: 'Protein Aggregation',
  startDate: '2023-01-15',
  endDate: '2025-12-31',
  duration: '2 yrs',
  tags: [
    'Alpha-Synuclein',
    'Protein Aggregation',
    'Biochemistry',
    'Cell Biology',
    'Mitochondrial Dysfunction',
  ],
  teamName: 'Discovery Team Alpha',
  teamId: 'team-1',
  description:
    "We hypothesize that the functions of multiple Parkinson's disease genes converge on common biochemical pathways involving endocytic organelles and/or mitochondria within vulnerable cell types.",
  originalGrant: {
    title: 'Original Grant - Alpha-Synuclein Study',
    description:
      "We hypothesize that the functions of multiple Parkinson's disease genes converge on common biochemical pathways involving endocytic organelles and/or mitochondria within vulnerable cell types. We will use a comprehensive cell biology tool kit including cutting-edge biochemistry, structural biology, microscopy at different scales, and genome editing tools to elucidate the function of selected Parkinson's disease genes and the effects produced by their dysfunction both in cellular models in vitro and in mouse and rat models.",
    proposalURL: 'https://example.com/proposal',
  },
  supplementGrant: {
    title: 'Supplement Grant - Extended Research',
    description:
      "Building on our original research, this supplement grant will allow us to explore additional pathways and expand our investigation into novel therapeutic targets for Parkinson's disease.",
    proposalURL: 'https://example.com/supplement-proposal',
  },
  milestones: [
    {
      id: 'm1',
      title: 'Phase 1 Complete',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      status: 'Complete',
      link: 'https://example.com/milestone1',
    },
    {
      id: 'm2',
      title: 'Phase 2 In Progress',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'In Progress',
    },
    {
      id: 'm3',
      title: 'Phase 3 Pending',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
      status: 'Pending',
      link: 'https://example.com/milestone3',
    },
    {
      id: 'm4',
      title: 'Phase 4 Complete',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'Complete',
    },
  ],
  fundedTeam: {
    id: 'team-1',
    name: 'Discovery Team Alpha',
    type: 'Discovery Team',
    researchTheme: 'Protein Aggregation',
    description:
      'Description text description text description text description text description text description text description text description text description text description text description text description text description.',
  },
  collaborators: [
    {
      id: 'user-1',
      displayName: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      href: '/network/users/user-1',
      avatarUrl: '',
    },
    {
      id: 'user-2',
      displayName: 'Jane Smith',
      firstName: 'Jane',
      lastName: 'Smith',
      href: '/network/users/user-2',
      avatarUrl: '',
    },
  ],
};

type DiscoveryProjectDetailParams = {
  projectId: string;
};

const DiscoveryProjectDetail: FC<Record<string, never>> = () => {
  const { projectId } = useParams<DiscoveryProjectDetailParams>();

  // TODO: Fetch project data from API using projectId
  const project = mockDiscoveryProjectDetail;

  if (!project) {
    return <NotFoundPage />;
  }

  const route = projects({})
    .discoveryProjects({})
    .discoveryProject({ projectId });

  return (
    <Frame title={project.title}>
      <ProjectDetailPage
        {...project}
        pointOfContactEmail="pm@example.com"
        aboutHref={route.about({}).$}
      >
        <ProjectDetailAbout {...project} pointOfContactEmail="pm@example.com" />
      </ProjectDetailPage>
    </Frame>
  );
};

export default DiscoveryProjectDetail;
