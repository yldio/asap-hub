import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentProps } from 'react';

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
  mockUseProjects.mockReturnValue({
    total: 1,
    items: [
      {
        id: 'trainee-1',
        title: 'Trainee Project',
        status: 'Active',
        projectType: 'Trainee',
        startDate: '2024-01-01',
        endDate: '2024-12-01',
        duration: '11 mos',
        tags: [],
        trainer: {
          id: 'trainer',
          displayName: 'Trainer One',
        },
        members: [
          {
            id: 'member-1',
            displayName: 'Member One',
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
