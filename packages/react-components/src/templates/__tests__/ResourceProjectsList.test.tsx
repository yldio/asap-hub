import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';

import ResourceProjectsList from '../ResourceProjectsList';

const mockProjects: ComponentProps<typeof ResourceProjectsList>['projects'] = [
  {
    id: '1',
    title: 'Test Resource Project 1',
    status: 'Active',
    resourceType: 'Database',
    isTeamBased: true,
    teamName: 'Resource Team Alpha',
    teamId: 'team-1',
    startDate: 'Jan 2023',
    endDate: 'Dec 2025',
    duration: '3 yrs',
    tags: ['Tag1', 'Tag2'],
    googleDriveLink: 'https://drive.google.com/example',
  },
  {
    id: '2',
    title: 'Test Resource Project 2',
    status: 'Complete',
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
    startDate: 'Jun 2022',
    endDate: 'May 2024',
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
  render(<ResourceProjectsList {...props} />);
  expect(screen.getByText('Test Resource Project 1')).toBeVisible();
  expect(screen.getByText('Test Resource Project 2')).toBeVisible();
});

it('renders the correct number of project cards', () => {
  render(<ResourceProjectsList {...props} />);
  expect(screen.getAllByTestId('project-card-id')).toHaveLength(2);
});

it('renders Resource Project type pill for each project', () => {
  render(<ResourceProjectsList {...props} />);
  const pills = screen.getAllByText('Resource Project');
  expect(pills).toHaveLength(2);
});
