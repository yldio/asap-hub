import { MemoryRouter } from 'react-router-dom';
import { ComponentProps, Suspense } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { network } from '@asap-hub/routing';
import { RecoilRoot } from 'recoil';

import { EMPTY_ALGOLIA_RESPONSE } from '@asap-hub/algolia';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import { TraineeProject } from '@asap-hub/model';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import TraineeProjects from '../TraineeProjects';
import { useProjects } from '../state';
import { getProjects } from '../api';

jest.mock('../state');
jest.mock('@asap-hub/frontend-utils', () => {
  const actual = jest.requireActual('@asap-hub/frontend-utils');
  return {
    ...actual,
    createCsvFileStream: jest
      .fn()
      .mockImplementation(() => ({ write: jest.fn(), end: jest.fn() })),
  };
});
jest.mock('../api', () => {
  const actual = jest.requireActual('../api');
  return {
    ...actual,
    getProjects: jest.fn(),
  };
});

const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;

const mockGetProjects = getProjects as jest.MockedFunction<typeof getProjects>;

const mockUseProjects = useProjects as jest.MockedFunction<typeof useProjects>;

const mockTraineeProject = {
  id: 'trainee-1',
  title: 'Trainee Project',
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
} as TraineeProject;

const props: ComponentProps<typeof TraineeProjects> = {
  searchQuery: '',
  debouncedSearchQuery: '',
  onChangeSearchQuery: jest.fn(),
  filters: new Set(),
  onChangeFilter: jest.fn(),
};

const statusFilter = 'Active';

beforeEach(() => {
  jest.clearAllMocks();
  mockUseProjects.mockReturnValue({
    total: 1,
    items: [mockTraineeProject],
    algoliaIndexName: 'index',
    algoliaQueryId: 'query',
  });
});

const renderTraineeProjects = (
  searchQuery: string = '',
  filters?: Set<string>,
) =>
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter>
              <TraineeProjects
                {...props}
                debouncedSearchQuery={searchQuery}
                filters={filters}
              />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

it('renders the Trainee Projects page', async () => {
  renderTraineeProjects();

  expect(
    await screen.findByText(
      /Trainee Projects provide early-career scientists with dedicated support/i,
    ),
  ).toBeVisible();

  expect(screen.getByText('Taylor Trainer')).toBeVisible();
});

it('renders trainer and members as links', async () => {
  mockUseProjects.mockReturnValueOnce({
    total: 1,
    items: [mockTraineeProject],
    algoliaIndexName: 'index',
    algoliaQueryId: 'query',
  });

  renderTraineeProjects();

  const trainerLink = await screen.findByRole('link', {
    name: 'Taylor Trainer',
  });
  expect(trainerLink).toHaveAttribute(
    'href',
    network({}).users({}).user({ userId: 'trainer-2' }).$,
  );

  const memberLink = await screen.findByRole('link', {
    name: 'Morgan Trainee',
  });
  expect(memberLink).toHaveAttribute(
    'href',
    network({}).users({}).user({ userId: 'member-2' }).$,
  );
});

it('triggers export with the expected parameters', async () => {
  mockGetProjects.mockResolvedValue({
    ...EMPTY_ALGOLIA_RESPONSE,
    nbHits: 1,
    hits: [
      {
        ...mockTraineeProject,
        __meta: {
          type: 'project',
        },
        objectID: 'trainee-project-id',
      },
    ],
  });
  const searchQuery = 'searched project name';
  renderTraineeProjects(searchQuery, new Set([statusFilter]));

  const csvButton = await screen.findByRole('button', { name: /csv/i });
  await userEvent.click(csvButton);
  expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
    expect.stringMatching(/TraineeProjects_\d+\.csv/),
    expect.anything(),
  );
  expect(mockGetProjects).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({
      searchQuery,
      statusFilters: [statusFilter],
      currentPage: 0,
      pageSize: 10,
      projectType: 'Trainee Project',
    }),
  );
});
