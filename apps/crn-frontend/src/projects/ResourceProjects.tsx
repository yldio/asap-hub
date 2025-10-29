import { FC, useMemo } from 'react';
import { SearchFrame } from '@asap-hub/frontend-utils';
import { ProjectsPage, ResourceProjectsList } from '@asap-hub/react-components';

// Mock data - this would come from API in real implementation
const mockResourceProjects = [
  {
    id: '1',
    title: 'PD Biomarker Database',
    status: 'Active' as const,
    projectType: 'Resource' as const,
    resourceType: 'Database',
    startDate: '2023-02-01',
    endDate: '2025-01-31',
    tags: ['Biomarkers', 'Database', 'Clinical Data'],
    googleDriveLink: 'https://drive.google.com/drive/folders/example1',
    isTeamBased: true,
    duration: '2 yrs',
    teamName: 'Resource Team Alpha',
    teamId: '1',
  },
  {
    id: '2',
    title: 'Open Source PD Analysis Tools',
    status: 'Complete' as const,
    projectType: 'Resource' as const,
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
        alumniSinceDate: '2022-10-27',
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
    duration: '3 yrs',
    teamName: 'Resource Team Beta',
    teamId: '2',
  },
  {
    id: '3',
    title: 'PD Model Organism Repository',
    status: 'Closed' as const,
    projectType: 'Resource' as const,
    resourceType: 'Biological Resources',
    startDate: '2022-01-01',
    endDate: '2024-12-31',
    tags: ['Animal Models', 'Repository', 'Biological Resources'],
    googleDriveLink: 'https://drive.google.com/drive/folders/example3',
    isTeamBased: true,
    duration: '2 yrs',
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

// Helper Mock function to filter projects based on search query
/* istanbul ignore next */
const filterProjects = (
  projects: typeof mockResourceProjects,
  searchQuery: string,
) => {
  const query = searchQuery.toLowerCase();
  return projects.filter((project) => {
    // Search in title
    if (project.title.toLowerCase().includes(query)) {
      return true;
    }

    return false;
  });
};

const ResourceProjects: FC<ResourceProjectsProps> = ({
  searchQuery,
  onChangeSearchQuery,
  filters,
  onChangeFilter,
}) => {
  // Filter projects based on search query
  const filteredProjects = useMemo(
    () => filterProjects(mockResourceProjects, searchQuery),
    [searchQuery],
  );

  return (
    <ProjectsPage
      page="Resource"
      searchQuery={searchQuery}
      onChangeSearchQuery={onChangeSearchQuery}
      filters={filters}
      onChangeFilter={onChangeFilter}
    >
      <SearchFrame title="Resource Projects">
        <ResourceProjectsList
          projects={filteredProjects}
          numberOfItems={filteredProjects.length}
          numberOfPages={1}
          currentPageIndex={0}
          renderPageHref={(pageIndex) => `#page-${pageIndex}`}
        />
      </SearchFrame>
    </ProjectsPage>
  );
};

export default ResourceProjects;
