import { MemoryRouter } from 'react-router-dom';
import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { network } from '@asap-hub/routing';

import TraineeProjects from '../TraineeProjects';
import { useProjects } from '../state';

jest.mock('../state');

const mockUseProjects = useProjects as jest.MockedFunction<typeof useProjects>;

const props: ComponentProps<typeof TraineeProjects> = {
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
        id: 'trainee-1',
        title: 'Trainee Project',
        status: 'Active',
        projectType: 'Trainee Project',
        startDate: '2024-01-01',
        endDate: '2024-12-01',
        duration: '11 mos',
        tags: [],
        members: [
          {
            id: 'member-1',
            firstName: 'Member',
            lastName: 'One',
            displayName: 'Member One',
            role: 'Trainee Project - Lead',
          },
          {
            id: 'trainer',
            firstName: 'Trainer',
            lastName: 'One',
            displayName: 'Trainer One',
            role: 'Trainee Project - Mentor',
          },
        ],
      },
    ],
    algoliaIndexName: 'index',
    algoliaQueryId: 'query',
  });
});

it('renders the Trainee Projects page', () => {
  const { container } = render(
    <MemoryRouter>
      <TraineeProjects {...props} />
    </MemoryRouter>,
  );
  expect(
    screen.getByText(
      /Trainee Projects provide early-career scientists with dedicated support/i,
    ),
  ).toBeVisible();
  expect(container.querySelector('section')).toBeInTheDocument();
  expect(screen.getByText('Trainer One')).toBeVisible();
});

it('renders trainer and members as links', () => {
  mockUseProjects.mockReturnValueOnce({
    total: 1,
    items: [
      {
        id: 'trainee-2',
        title: 'Another Trainee Project',
        status: 'Active',
        projectType: 'Trainee Project',
        startDate: '2024-03-01',
        endDate: '2025-03-01',
        duration: '1 yr',
        tags: [],
        members: [
          {
            id: 'member-2',
            firstName: 'Morgan',
            lastName: 'Trainee',
            displayName: 'Morgan Trainee',
            role: 'Trainee Project - Lead',
          },
          {
            id: 'trainer-2',
            firstName: 'Taylor',
            lastName: 'Trainer',
            displayName: 'Taylor Trainer',
            role: 'Trainee Project - Mentor',
          },
        ],
      },
    ],
    algoliaIndexName: 'index',
    algoliaQueryId: 'query',
  });

  render(
    <MemoryRouter>
      <TraineeProjects {...props} />
    </MemoryRouter>,
  );

  expect(screen.getByRole('link', { name: 'Taylor Trainer' })).toHaveAttribute(
    'href',
    network({}).users({}).user({ userId: 'trainer-2' }).$,
  );
  expect(screen.getByRole('link', { name: 'Morgan Trainee' })).toHaveAttribute(
    'href',
    network({}).users({}).user({ userId: 'member-2' }).$,
  );
});
