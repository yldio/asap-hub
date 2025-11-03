import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Frame } from '@asap-hub/frontend-utils';
import {
  ProjectDetailPage,
  ProjectDetailAbout,
  NotFoundPage,
} from '@asap-hub/react-components';
import { projects } from '@asap-hub/routing';
import { TraineeProjectDetail as TraineeProjectDetailType } from '@asap-hub/model';

// Mock data - this would come from API in real implementation
const mockTraineeProjectDetail: TraineeProjectDetailType = {
  id: '1',
  title: 'Trainee Project Title',
  status: 'Active',
  projectType: 'Trainee',
  startDate: '2024-01-01',
  endDate: '2026-12-31',
  duration: '2 yrs',
  tags: ['Training', 'Research', 'Mentorship'],
  trainer: {
    id: 'trainer-1',
    displayName: 'Dr. Sarah Mentor',
    firstName: 'Sarah',
    lastName: 'Mentor',
    role: 'Principal Investigator',
    href: '/network/users/trainer-1',
    avatarUrl: '',
    teams: [
      { id: 'team-1', displayName: 'Martinez Lab' },
      { id: 'team-2', displayName: 'Neuroscience Research Group' },
      { id: 'team-3', displayName: 'PD Consortium' },
    ],
  },
  members: [
    {
      id: 'trainee-1',
      displayName: 'Emily Trainee',
      firstName: 'Emily',
      lastName: 'Trainee',
      role: 'PhD Candidate',
      href: '/network/users/trainee-1',
      avatarUrl: '',
      alumniSinceDate: '2024-01-01',
      teams: [{ id: 'team-1', displayName: 'Martinez Lab' }],
    },
    {
      id: 'trainee-2',
      displayName: 'Michael Student',
      firstName: 'Michael',
      lastName: 'Student',
      role: 'Postdoctoral Fellow',
      href: '/network/users/trainee-2',
      avatarUrl: '',
      teams: [
        { id: 'team-1', displayName: 'Martinez Lab' },
        { id: 'team-4', displayName: 'Genomics Lab' },
      ],
    },
  ],
  description:
    "This trainee project focuses on developing skills and conducting research in Parkinson's disease pathology and therapeutic strategies.",
  originalGrant: {
    title: 'Trainee Grant - Research Training',
    description:
      "This training program will provide comprehensive education and research experience in Parkinson's disease research, focusing on molecular mechanisms and potential therapeutic interventions.",
    proposalURL: 'https://example.com/trainee-proposal',
  },
  milestones: [
    {
      id: 'm1',
      title: 'Training Milestone 1',
      description:
        "Complete foundational coursework and laboratory training modules. This milestone is funded by the Parkinson's Disease Research Foundation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      status: 'Complete',
    },
    {
      id: 'm2',
      title: 'Research Milestone',
      description:
        "Prepare and submit first-author manuscript for publication. This milestone is funded by the Parkinson's Disease Research Foundation.",
      status: 'In Progress',
    },
    {
      id: 'm3',
      title: 'Publication Goal',
      description:
        "Initiate independent research project under mentor guidance. This milestone is funded by the Parkinson's Disease Research Foundation. The project is funded by the Parkinson's Disease Research Foundation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      status: 'Pending',
    },
    {
      id: 'm4',
      title: 'Publication Goal',
      description:
        "Prepare and submit first-author manuscript for publication. This milestone is funded by the Parkinson's Disease Research Foundation.",
      status: 'Pending',
    },
    {
      id: 'm5',
      title: 'Publication Goal',
      description:
        "Prepare and submit first-author manuscript for publication. This milestone is funded by the Parkinson's Disease Research Foundation.",
      status: 'Pending',
    },
  ],
};

type TraineeProjectDetailParams = {
  projectId: string;
};

const TraineeProjectDetail: FC<Record<string, never>> = () => {
  const { projectId } = useParams<TraineeProjectDetailParams>();

  // TODO: Fetch project data from API using projectId
  const project = mockTraineeProjectDetail;

  // istanbul ignore next - will be covered when API integration is implemented
  if (!project) {
    return <NotFoundPage />;
  }

  const route = projects({}).traineeProjects({}).traineeProject({ projectId });

  return (
    <Frame title={project.title}>
      <ProjectDetailPage
        {...project}
        pointOfContactEmail="trainer@example.com"
        aboutHref={route.about({}).$}
      >
        <ProjectDetailAbout
          {...project}
          pointOfContactEmail="trainer@example.com"
        />
      </ProjectDetailPage>
    </Frame>
  );
};

export default TraineeProjectDetail;
