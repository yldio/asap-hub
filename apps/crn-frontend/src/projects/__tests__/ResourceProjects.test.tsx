import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentProps } from 'react';

import ResourceProjects from '../ResourceProjects';
import { useProjects } from '../state';

jest.mock('../state');

const mockUseProjects = useProjects as jest.MockedFunction<typeof useProjects>;

const props: ComponentProps<typeof ResourceProjects> = {
  searchQuery: '',
  debouncedSearchQuery: '',
  onChangeSearchQuery: jest.fn(),
  filters: new Set(),
  onChangeFilter: jest.fn(),
};

beforeEach(() => {
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
