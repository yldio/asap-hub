import { FC } from 'react';
import { SearchFrame } from '@asap-hub/frontend-utils';
import { ProjectsPage, TraineeProjectsList } from '@asap-hub/react-components';

// Mock data - this would come from API in real implementation
const mockTraineeProjects = [
  {
    id: '1',
    title: 'Early Detection Biomarkers in PD',
    status: 'Active' as const,
    projectType: 'Trainee' as const,
    trainer: {
      id: '1',
      displayName: 'Dr. Sarah Wilson',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@example.com',
      href: '/users/1',
    },
    members: [
      {
        id: '2',
        displayName: 'Dr. Emily Chen',
        firstName: 'Emily',
        lastName: 'Chen',
        email: 'emily.chen@example.com',
        href: '/users/2',
      },
    ],
    startDate: '2023-09-01',
    endDate: '2025-08-31',
    tags: ['Biomarkers', 'Early Detection', 'Clinical Research'],
    duration: '2 yrs',
  },
  {
    id: '2',
    title: 'Novel Therapeutic Approaches for PD',
    status: 'Complete' as const,
    projectType: 'Trainee' as const,
    trainer: {
      id: '3',
      displayName: 'Dr. Robert Kim',
      firstName: 'Robert',
      lastName: 'Kim',
      email: 'robert.kim@example.com',
      href: '/users/3',
    },
    members: [
      {
        id: '4',
        displayName: 'Dr. Maria Garcia',
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.garcia@example.com',
        href: '/users/4',
      },
    ],
    startDate: '2023-06-01',
    endDate: '2026-06-30',
    tags: ['Therapeutics', 'Drug Discovery', 'Preclinical Studies'],
    duration: '3 yrs',
  },
  {
    id: '3',
    title: 'Digital Health Tools for PD Monitoring',
    status: 'Closed' as const,
    projectType: 'Trainee' as const,
    trainer: {
      id: '5',
      displayName: 'Dr. Amanda Foster',
      firstName: 'Amanda',
      lastName: 'Foster',
      email: 'amanda.foster@example.com',
      href: '/users/5',
    },
    members: [
      {
        id: '6',
        displayName: 'Dr. David Lee',
        firstName: 'David',
        lastName: 'Lee',
        email: 'david.lee@example.com',
        href: '/users/6',
      },
      {
        id: '7',
        displayName: 'Dr. James Taylor',
        firstName: 'James',
        lastName: 'Taylor',
        email: 'james.taylor@example.com',
        href: '/users/7',
      },
    ],
    startDate: '2022-01-01',
    endDate: '2024-12-31',
    tags: ['Digital Health', 'Monitoring', 'Technology', 'Healthcare'],
    duration: '2 yrs',
  },
];

type TraineeProjectsProps = {
  searchQuery: string;
  onChangeSearchQuery?: (newSearchQuery: string) => void;
  filters?: Set<string>;
  onChangeFilter?: (filter: string) => void;
};

const TraineeProjects: FC<TraineeProjectsProps> = ({
  searchQuery,
  onChangeSearchQuery,
  filters,
  onChangeFilter,
}) => (
  <ProjectsPage
    page="Trainee"
    searchQuery={searchQuery}
    onChangeSearchQuery={onChangeSearchQuery}
    filters={filters}
    onChangeFilter={onChangeFilter}
  >
    <SearchFrame title="Trainee Projects">
      <TraineeProjectsList
        projects={mockTraineeProjects}
        numberOfItems={mockTraineeProjects.length}
        numberOfPages={1}
        currentPageIndex={0}
        renderPageHref={(pageIndex) => `#page-${pageIndex}`}
      />
    </SearchFrame>
  </ProjectsPage>
);

export default TraineeProjects;
