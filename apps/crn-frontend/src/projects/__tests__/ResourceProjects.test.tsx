import { MemoryRouter } from 'react-router-dom';
import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { network } from '@asap-hub/routing';

import ResourceProjects from '../ResourceProjects';
import { RESOURCE_TYPE_FILTER_PREFIX } from '../utils';
import { useProjects, useProjectFacets } from '../state';

jest.mock('../state');

const mockUseProjects = useProjects as jest.MockedFunction<typeof useProjects>;
const mockUseProjectFacets = useProjectFacets as jest.MockedFunction<
  typeof useProjectFacets
>;

const props: ComponentProps<typeof ResourceProjects> = {
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
        id: 'resource-1',
        title: 'Resource Project',
        status: 'Active',
        projectType: 'Resource',
        resourceType: 'Database',
        startDate: '2024-01-01',
        endDate: '2024-12-01',
        duration: '11 mos',
        tags: [],
        isTeamBased: true,
        teamName: 'Resource Team',
        teamId: 'team-2',
        googleDriveLink: undefined,
      },
    ],
    algoliaIndexName: 'index',
    algoliaQueryId: 'query',
  });
  mockUseProjectFacets.mockReturnValue({
    resourceType: { Database: 5 },
  });
});

it('renders the Resource Projects page', () => {
  const { container } = render(
    <MemoryRouter>
      <ResourceProjects {...props} />
    </MemoryRouter>,
  );
  expect(
    screen.getByText(
      /Resource Projects are projects whose primary objective is to generate research tools/i,
    ),
  ).toBeVisible();
  expect(container.querySelector('section')).toBeInTheDocument();
  expect(screen.getByText('Resource Team')).toBeVisible();
});

it('renders resource project members as links when the project is not team-based', () => {
  mockUseProjects.mockReturnValueOnce({
    total: 1,
    items: [
      {
        id: 'resource-2',
        title: 'Resource Individual Project',
        status: 'Active',
        projectType: 'Resource',
        resourceType: 'Data Portal',
        startDate: '2024-01-01',
        endDate: '2024-12-01',
        duration: '11 mos',
        tags: [],
        isTeamBased: false,
        members: [
          {
            id: 'resource-member-1',
            firstName: 'Pat',
            lastName: 'Scientist',
            displayName: 'Pat Scientist',
          },
        ],
      },
    ],
    algoliaIndexName: 'index',
    algoliaQueryId: 'query',
  });

  render(
    <MemoryRouter>
      <ResourceProjects {...props} />
    </MemoryRouter>,
  );

  expect(screen.getByRole('link', { name: 'Pat Scientist' })).toHaveAttribute(
    'href',
    network({}).users({}).user({ userId: 'resource-member-1' }).$,
  );
});

it('passes Algolia facet filters when the resource type filter is active', () => {
  const resourceValue = `${RESOURCE_TYPE_FILTER_PREFIX}Dataset`;

  render(
    <MemoryRouter>
      <ResourceProjects {...props} filters={new Set([resourceValue])} />
    </MemoryRouter>,
  );

  expect(mockUseProjects).toHaveBeenLastCalledWith(
    expect.objectContaining({
      facetFilters: { resourceType: ['Dataset'] },
    }),
  );
});
