import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentProps } from 'react';

import DiscoveryProjects from '../DiscoveryProjects';
import { useProjects } from '../state';

jest.mock('../state');

const mockUseProjects = useProjects as jest.MockedFunction<typeof useProjects>;

const props: ComponentProps<typeof DiscoveryProjects> = {
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
        id: 'proj-1',
        title: 'Discovery Project',
        status: 'Active',
        projectType: 'Discovery',
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
