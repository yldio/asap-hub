import { Suspense } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import ProjectOutputs from '../ProjectOutputs';

jest.mock('../projectOutputs.mock', () => ({
  createProjectOutputsMock: jest.fn(),
  createProjectDraftOutputsMock: jest.fn(),
}));

import {
  createProjectOutputsMock,
  createProjectDraftOutputsMock,
} from '../projectOutputs.mock';

const mockedOutputs = createProjectOutputsMock as jest.Mock;
const mockedDrafts = createProjectDraftOutputsMock as jest.Mock;

const renderProjectOutputs = (
  draftOutputs = false,
  initialEntries: string[] = ['/'],
) => {
  const router = createMemoryRouter(
    [
      {
        path: '*',
        element: (
          <ProjectOutputs
            projectId="p1"
            projectTitle="Project Alpha"
            draftOutputs={draftOutputs}
          />
        ),
      },
    ],
    { initialEntries },
  );
  return render(
    <RecoilRoot>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </RecoilRoot>,
  );
};

beforeEach(() => {
  mockedOutputs.mockReset();
  mockedDrafts.mockReset();
});

describe('Published outputs', () => {
  it('renders NoOutputsPage when no outputs', () => {
    mockedOutputs.mockReturnValue([]);
    renderProjectOutputs(false);
    expect(screen.getByText('No outputs available.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'When this project shares an output, it will be listed here.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the list when there are outputs', () => {
    mockedOutputs.mockReturnValue([
      {
        id: 'o1',
        title: 'Example output',
        documentType: 'Article',
        type: 'Preprint',
        authors: [],
        teams: [],
        keywords: [],
        published: true,
        isInReview: false,
        created: new Date(2024, 0, 1).toISOString(),
        addedDate: new Date(2024, 0, 1).toISOString(),
        source: 'project',
        projects: [{ id: 'p1', title: 'Project Alpha', href: '/projects/p1' }],
      },
    ]);
    renderProjectOutputs(false);
    expect(screen.getByText('Example output')).toBeInTheDocument();
    expect(screen.queryByText('No outputs available.')).not.toBeInTheDocument();
  });
});

describe('Draft outputs', () => {
  it('renders NoOutputsPage with draft copy when no drafts', () => {
    mockedDrafts.mockReturnValue([]);
    renderProjectOutputs(true);
    expect(screen.getByText('No draft outputs available.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'When this project shares a draft output, it will be listed here.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the list when there are draft outputs', () => {
    mockedDrafts.mockReturnValue([
      {
        id: 'd1',
        title: 'Example draft',
        documentType: 'Article',
        type: 'Preprint',
        authors: [],
        teams: [],
        keywords: [],
        published: false,
        isInReview: false,
        created: new Date(2024, 0, 1).toISOString(),
        addedDate: new Date(2024, 0, 1).toISOString(),
        source: 'project',
        projects: [{ id: 'p1', title: 'Project Alpha', href: '/projects/p1' }],
      },
    ]);
    renderProjectOutputs(true);
    expect(screen.getByText('Example draft')).toBeInTheDocument();
    expect(
      screen.queryByText('No draft outputs available.'),
    ).not.toBeInTheDocument();
  });
});
