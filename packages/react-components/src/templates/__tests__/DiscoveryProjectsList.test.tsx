import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentProps } from 'react';

import DiscoveryProjectsList from '../DiscoveryProjectsList';

const mockProjects: ComponentProps<typeof DiscoveryProjectsList>['projects'] = [
  {
    id: '1',
    title: 'Test Discovery Project 1',
    status: 'Active',
    projectType: 'Discovery Project' as const,
    researchTheme: 'Genetics',
    teamName: 'Team Alpha',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    duration: '3 yrs',
    tags: ['Tag1', 'Tag2'],
  },
  {
    id: '2',
    title: 'Test Discovery Project 2',
    status: 'Completed',
    projectType: 'Discovery Project' as const,
    researchTheme: 'Biomarkers',
    teamName: 'Team Beta',
    teamId: 'team-2',
    startDate: '2022-06-01',
    endDate: '2024-05-31',
    duration: '2 yrs',
    tags: ['Tag3'],
  },
];

const props: ComponentProps<typeof DiscoveryProjectsList> = {
  projects: mockProjects,
  numberOfItems: 2,
  numberOfPages: 1,
  currentPageIndex: 0,
  renderPageHref: () => '#',
};

it('renders all discovery projects', () => {
  render(
    <MemoryRouter>
      <DiscoveryProjectsList {...props} />
    </MemoryRouter>,
  );
  expect(screen.getByText('Test Discovery Project 1')).toBeVisible();
  expect(screen.getByText('Test Discovery Project 2')).toBeVisible();
});

it('renders the correct number of project cards', () => {
  render(
    <MemoryRouter>
      <DiscoveryProjectsList {...props} />
    </MemoryRouter>,
  );
  expect(screen.getAllByTestId('project-card-id')).toHaveLength(2);
});

it('renders Discovery Project type pill for each project', () => {
  render(
    <MemoryRouter>
      <DiscoveryProjectsList {...props} />
    </MemoryRouter>,
  );
  const pills = screen.getAllByText('Discovery Project');
  expect(pills).toHaveLength(2);
});
