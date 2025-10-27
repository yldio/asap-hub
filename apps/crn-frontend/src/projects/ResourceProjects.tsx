import { FC } from 'react';
import { SearchFrame } from '@asap-hub/frontend-utils';
import { ProjectsPage, ResourceProjectsList } from '@asap-hub/react-components';

// Mock data - this would come from API in real implementation
const mockResourceProjects = [
  {
    id: '1',
    title: 'PD Biomarker Database',
    status: 'Active' as const,
    projectType: 'Resource',
    resourceType: 'Database',
    fundedTeam: 'Resource Team Alpha',
    startDate: '2023-02-01',
    endDate: '2025-01-31',
    tags: ['Biomarkers', 'Database', 'Clinical Data'],
    googleDriveLink: 'https://drive.google.com/drive/folders/example1',
    isTeamBased: true,
    duration: '2 years',
    teamName: 'Resource Team Alpha',
    teamId: '1',
  },
  {
    id: '2',
    title: 'Open Source PD Analysis Tools',
    status: 'Complete' as const,
    projectType: 'Resource',
    resourceType: 'Software Tools',
    members: [
      {
        id: '1',
        displayName: 'Dr. Jane Smith',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        href: '/users/1',
      },
      {
        id: '2',
        displayName: 'Dr. John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        href: '/users/2',
      },
      {
        id: '3',
        displayName: 'Dr. Alice Johnson',
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        href: '/users/3',
      },
    ],
    startDate: '2023-04-15',
    endDate: '2026-04-14',
    tags: ['Software', 'Open Source', 'Data Analysis'],
    googleDriveLink: 'https://drive.google.com/drive/folders/example2',
    isTeamBased: false,
    duration: '3 years',
    teamName: 'Resource Team Beta',
    teamId: '2',
  },
  {
    id: '3',
    title: 'PD Model Organism Repository',
    status: 'Closed' as const,
    projectType: 'Resource',
    resourceType: 'Biological Resources',
    fundedTeam: 'Resource Team Beta',
    startDate: '2022-01-01',
    endDate: '2024-12-31',
    tags: ['Animal Models', 'Repository', 'Biological Resources'],
    googleDriveLink: 'https://drive.google.com/drive/folders/example3',
    isTeamBased: true,
    duration: '2 years',
    teamName: 'Resource Team Beta',
    teamId: '2',
  },
];

type ResourceProjectsProps = {
  searchQuery: string;
  onChangeSearchQuery?: (newSearchQuery: string) => void;
  filters?: Set<string>;
  onChangeFilter?: (filter: string) => void;
};

const ResourceProjects: FC<ResourceProjectsProps> = ({
  searchQuery,
  onChangeSearchQuery,
  filters,
  onChangeFilter,
}) => (
  <ProjectsPage
    page="Resource"
    searchQuery={searchQuery}
    onChangeSearchQuery={onChangeSearchQuery}
    filters={filters}
    onChangeFilter={onChangeFilter}
  >
    <SearchFrame title="Resource Projects">
      <ResourceProjectsList
        projects={mockResourceProjects}
        numberOfItems={mockResourceProjects.length}
        numberOfPages={1}
        currentPageIndex={0}
        renderPageHref={(pageIndex) => `#page-${pageIndex}`}
      />
    </SearchFrame>
  </ProjectsPage>
);

export default ResourceProjects;
