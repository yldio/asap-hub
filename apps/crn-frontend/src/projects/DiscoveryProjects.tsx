import { FC } from 'react';
import { SearchFrame } from '@asap-hub/frontend-utils';
import {
  ProjectsPage,
  DiscoveryProjectsList,
} from '@asap-hub/react-components';

// Mock data - this would come from API in real implementation
const mockDiscoveryProjects = [
  {
    id: '1',
    title: 'Alpha-Synuclein Aggregation Mechanisms',
    status: 'Active' as const,
    projectType: 'Discovery',
    researchTheme: 'Protein Aggregation',
    fundedTeam: 'Discovery Team Alpha',
    startDate: '2023-01-15',
    endDate: '2025-12-31',
    tags: [
      'Alpha-Synuclein',
      'Protein Aggregation',
      'Biochemistry',
      'Cell Biology',
      'Mitochondrial Dysfunction',
    ],
    teamName: 'Discovery Team Alpha',
    duration: '2 years',
  },
  {
    id: '2',
    title: 'Neural Circuit Dysfunction in PD',
    status: 'Complete' as const,
    projectType: 'Discovery',
    researchTheme: 'Neural Circuits',
    fundedTeam: 'Discovery Team Beta',
    startDate: '2023-06-01',
    endDate: '2026-05-31',
    tags: ['Neural Circuits', 'Electrophysiology', 'Neuroimaging'],
    teamName: 'Discovery Team Beta',
    duration: '3 years',
  },
  {
    id: '3',
    title: 'Mitochondrial Dysfunction in PD Models',
    status: 'Closed' as const,
    projectType: 'Discovery',
    researchTheme: 'Mitochondrial Biology',
    fundedTeam: 'Discovery Team Gamma',
    startDate: '2022-03-01',
    endDate: '2024-02-28',
    tags: ['Mitochondria', 'Cell Biology', 'Animal Models'],
    teamName: 'Discovery Team Gamma',
    duration: '2 years',
  },
];

type DiscoveryProjectsProps = {
  searchQuery: string;
  onChangeSearchQuery?: (newSearchQuery: string) => void;
  filters?: Set<string>;
  onChangeFilter?: (filter: string) => void;
};

const DiscoveryProjects: FC<DiscoveryProjectsProps> = ({
  searchQuery,
  onChangeSearchQuery,
  filters,
  onChangeFilter,
}) => (
  <ProjectsPage
    page="Discovery"
    searchQuery={searchQuery}
    onChangeSearchQuery={onChangeSearchQuery}
    filters={filters}
    onChangeFilter={onChangeFilter}
  >
    <SearchFrame title="Discovery Projects">
      <DiscoveryProjectsList
        projects={mockDiscoveryProjects}
        numberOfItems={mockDiscoveryProjects.length}
        numberOfPages={1}
        currentPageIndex={0}
        renderPageHref={(pageIndex) => `#page-${pageIndex}`}
      />
    </SearchFrame>
  </ProjectsPage>
);

export default DiscoveryProjects;
