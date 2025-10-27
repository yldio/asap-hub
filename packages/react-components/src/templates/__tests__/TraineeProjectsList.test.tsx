import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';

import TraineeProjectsList from '../TraineeProjectsList';

const mockProjects: ComponentProps<typeof TraineeProjectsList>['projects'] = [
  {
    id: '1',
    title: 'Test Trainee Project 1',
    status: 'Active',
    trainer: {
      id: '1',
      displayName: 'Dr. Mentor One',
      firstName: 'Mentor',
      lastName: 'One',
      email: 'mentor1@example.com',
      href: '/users/1',
    },
    members: [
      {
        id: '2',
        displayName: 'Dr. Student One',
        firstName: 'Student',
        lastName: 'One',
        email: 'student1@example.com',
        href: '/users/2',
      },
    ],
    startDate: 'Jan 2023',
    endDate: 'Dec 2025',
    duration: '3 yrs',
    tags: ['Tag1', 'Tag2'],
  },
  {
    id: '2',
    title: 'Test Trainee Project 2',
    status: 'Complete',
    trainer: {
      id: '3',
      displayName: 'Dr. Mentor Two',
      firstName: 'Mentor',
      lastName: 'Two',
      email: 'mentor2@example.com',
      href: '/users/3',
    },
    members: [
      {
        id: '4',
        displayName: 'Dr. Student Two',
        firstName: 'Student',
        lastName: 'Two',
        email: 'student2@example.com',
        href: '/users/4',
      },
    ],
    startDate: 'Jun 2022',
    endDate: 'May 2024',
    duration: '2 yrs',
    tags: ['Tag3'],
  },
];

const props: ComponentProps<typeof TraineeProjectsList> = {
  projects: mockProjects,
  numberOfItems: 2,
  numberOfPages: 1,
  currentPageIndex: 0,
  renderPageHref: () => '#',
};

it('renders all trainee projects', () => {
  render(<TraineeProjectsList {...props} />);
  expect(screen.getByText('Test Trainee Project 1')).toBeVisible();
  expect(screen.getByText('Test Trainee Project 2')).toBeVisible();
});

it('renders the correct number of project cards', () => {
  render(<TraineeProjectsList {...props} />);
  expect(screen.getAllByTestId('project-card-id')).toHaveLength(2);
});

it('renders Trainee Project type pill for each project', () => {
  render(<TraineeProjectsList {...props} />);
  const pills = screen.getAllByText('Trainee Project');
  expect(pills).toHaveLength(2);
});
