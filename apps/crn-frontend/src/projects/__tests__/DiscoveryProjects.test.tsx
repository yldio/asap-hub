import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentProps } from 'react';

import DiscoveryProjects from '../DiscoveryProjects';
import { useProjects } from '../state';
import { useResearchThemes } from '../../shared-state/shared-research';

jest.mock('../state');
jest.mock('../../shared-state/shared-research');

const mockUseProjects = useProjects as jest.MockedFunction<typeof useProjects>;
const mockUseResearchThemes = useResearchThemes as jest.MockedFunction<
  typeof useResearchThemes
>;

const props: ComponentProps<typeof DiscoveryProjects> = {
  searchQuery: '',
  debouncedSearchQuery: '',
  onChangeSearchQuery: jest.fn(),
  filters: new Set(),
  onChangeFilter: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseProjects.mockReturnValue({
    total: 1,
    items: [
      {
        id: 'proj-1',
        title: 'Discovery Project',
        status: 'Active',
        projectType: 'Discovery Project',
        researchTheme: 'Theme',
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        duration: '5 mos',
        tags: [],
        teamName: 'Discovery Team',
        teamId: 'team-1',
      },
    ],
    algoliaIndexName: 'index',
    algoliaQueryId: 'query',
  });
  mockUseResearchThemes.mockReturnValue([
    { id: 'theme-1', name: 'Neuro' },
    { id: 'theme-2', name: 'Neurodegeneration' },
    { id: 'theme-3', name: 'Cell Biology' },
  ]);
});

it('renders the Discovery Projects page', () => {
  const { container } = render(
    <MemoryRouter>
      <DiscoveryProjects {...props} />
    </MemoryRouter>,
  );
  expect(
    screen.getByText(
      /Discovery Projects are collaborative research projects whose primary objective/i,
    ),
  ).toBeVisible();
  expect(container.querySelector('section')).toBeInTheDocument();
  expect(screen.getByText('Discovery Team')).toBeVisible();
});

it('passes Algolia facet filters when the discovery theme filter is active', () => {
  const themeValue = 'Neuro';

  render(
    <MemoryRouter>
      <DiscoveryProjects {...props} filters={new Set([themeValue])} />
    </MemoryRouter>,
  );

  expect(mockUseProjects).toHaveBeenLastCalledWith(
    expect.objectContaining({
      facetFilters: { researchTheme: ['Neuro'] },
    }),
  );
});
