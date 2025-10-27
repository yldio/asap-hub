import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';

import DiscoveryProjectsList from '../DiscoveryProjectsList';

const mockProjects: ComponentProps<typeof DiscoveryProjectsList>['projects'] = [
  {
    id: '1',
    title: 'Test Discovery Project 1',
    status: 'Active',
    researchTheme: 'Genetics',
    teamName: 'Team Alpha',
    startDate: 'Jan 2023',
    endDate: 'Dec 2025',
    duration: '3 yrs',
    tags: ['Tag1', 'Tag2'],
  },
  {
    id: '2',
    title: 'Test Discovery Project 2',
    status: 'Complete',
    researchTheme: 'Biomarkers',
    teamName: 'Team Beta',
    teamId: 'team-2',
    startDate: 'Jun 2022',
    endDate: 'May 2024',
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
  render(<DiscoveryProjectsList {...props} />);
  expect(screen.getByText('Test Discovery Project 1')).toBeVisible();
  expect(screen.getByText('Test Discovery Project 2')).toBeVisible();
});

it('renders the correct number of project cards', () => {
  render(<DiscoveryProjectsList {...props} />);
  expect(screen.getAllByTestId('project-card-id')).toHaveLength(2);
});

it('renders Discovery Project type pill for each project', () => {
  render(<DiscoveryProjectsList {...props} />);
  const pills = screen.getAllByText('Discovery Project');
  expect(pills).toHaveLength(2);
});
