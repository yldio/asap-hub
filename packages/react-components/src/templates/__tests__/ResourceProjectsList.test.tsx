import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentProps } from 'react';

import ResourceProjectsList from '../ResourceProjectsList';

const mockProjects: ComponentProps<typeof ResourceProjectsList>['projects'] = [
  {
    id: '1',
    title: 'Test Resource Project 1',
    status: 'Active',
    statusRank: 1,
    projectType: 'Resource Project' as const,
    resourceType: 'Database',
    isTeamBased: true,
    teamName: 'Resource Team Alpha',
    teamId: 'team-1',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    duration: '3 yrs',
    tags: ['Tag1', 'Tag2'],
    googleDriveLink: 'https://drive.google.com/example',
  },
  {
    id: '2',
    title: 'Test Resource Project 2',
    status: 'Completed',
    statusRank: 2,
    projectType: 'Resource Project' as const,
    resourceType: 'Software',
    isTeamBased: false,
    members: [
      {
        id: '1',
        displayName: 'Dr. John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        href: '/users/1',
      },
    ],
    startDate: '2022-06-01',
    endDate: '2024-05-31',
    duration: '2 yrs',
    tags: ['Tag3'],
  },
];

const props: ComponentProps<typeof ResourceProjectsList> = {
  projects: mockProjects,
  numberOfItems: 2,
  numberOfPages: 1,
  currentPageIndex: 0,
  renderPageHref: () => '#',
};

it('renders all resource projects', () => {
  render(
    <MemoryRouter>
      <ResourceProjectsList {...props} />
    </MemoryRouter>,
  );
  expect(screen.getByText('Test Resource Project 1')).toBeVisible();
  expect(screen.getByText('Test Resource Project 2')).toBeVisible();
});

it('renders the correct number of project cards', () => {
  render(
    <MemoryRouter>
      <ResourceProjectsList {...props} />
    </MemoryRouter>,
  );
  expect(screen.getAllByTestId('project-card-id')).toHaveLength(2);
});

it('renders Resource Project type pill for each project', () => {
  render(
    <MemoryRouter>
      <ResourceProjectsList {...props} />
    </MemoryRouter>,
  );
  const pills = screen.getAllByText('Resource Project');
  expect(pills).toHaveLength(2);
});
