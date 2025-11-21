import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { network } from '@asap-hub/routing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps, Suspense } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { EligibilityReasonProvider } from '../EligibilityReasonProvider';
import { ManuscriptToastProvider } from '../ManuscriptToastProvider';
import { getGeneratedShortDescription } from '../../../shared-api/content-generator';
import { refreshTeamState } from '../state';
import TeamManuscript from '../TeamManuscript';

jest.mock('../../../shared-api/content-generator');

jest.setTimeout(100_000);

const manuscriptResponse = { id: '1', title: 'The Manuscript' };

const teamId = '42';
const defaultInitialEntries = [
  network({}).teams({}).team({ teamId }).workspace({}).createManuscript({}).$,
];

jest.mock('../../users/api');

jest.mock('../api', () => ({
  createManuscript: jest.fn().mockResolvedValue(manuscriptResponse),
  getManuscript: jest.fn().mockResolvedValue(null),
  resubmitManuscript: jest.fn().mockResolvedValue(null),
  uploadManuscriptFileViaPresignedUrl: jest.fn().mockResolvedValue({
    filename: 'manuscript.pdf',
    url: 'https://example.com/manuscript.pdf',
    id: 'file-id',
  }),
  getTeam: jest.fn().mockResolvedValue({ id: teamId, displayName: 'Team A' }),
  getLabs: jest.fn().mockResolvedValue([{ id: 'lab-1', name: 'Lab 1' }]),
  getTeams: jest
    .fn()
    .mockResolvedValue([{ id: teamId, displayName: 'Team A' }]),
}));

jest.mock('../../../shared-api/impact', () => ({
  getImpacts: jest.fn().mockResolvedValue({
    items: [{ id: 'impact-1', name: 'Impact 1' }],
  }),
}));

const mockSetFormType = jest.fn();
// mock useManuscriptToast hook
jest.mock('../useManuscriptToast', () => {
  const originalModule = jest.requireActual('../useManuscriptToast');
  return {
    ...originalModule,
    useManuscriptToast: jest.fn(() => ({
      setFormType: mockSetFormType,
      eligibilityReasons: [],
    })),
  };
});

const mockGetGeneratedShortDescription =
  getGeneratedShortDescription as jest.MockedFunction<
    typeof getGeneratedShortDescription
  >;

beforeEach(() => {
  mockSetFormType.mockReset();
  jest.spyOn(console, 'error').mockImplementation();
});

const renderPage = async (
  user: ComponentProps<typeof Auth0Provider>['user'] = {},
  resubmit: boolean = false,
  initialPath: string = defaultInitialEntries[0]!,
) => {
  const path =
    network.template +
    network({}).teams.template +
    network({}).teams({}).team.template +
    network({}).teams({}).team({ teamId }).workspace.template +
    network({}).teams({}).team({ teamId }).workspace({}).createManuscript
      .template;

  const router = createMemoryRouter(
    [
      {
        path,
        element: (
          <ManuscriptToastProvider>
            <EligibilityReasonProvider>
              <TeamManuscript teamId={teamId} resubmitManuscript={resubmit} />
            </EligibilityReasonProvider>
          </ManuscriptToastProvider>
        ),
      },
    ],
    {
      initialEntries: [initialPath],
    },
  );

  const { container } = render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshTeamState(teamId), Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <RouterProvider router={router} />
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  return { container };
};

it('renders manuscript form page', async () => {
  const { container } = await renderPage();

  await waitFor(() => {
    expect(container).toHaveTextContent(
      'Start a new manuscript to receive an itemized compliance report outlining action items for compliance with the ASAP Open Science Policy',
    );
  });
  expect(container).toHaveTextContent('What are you sharing');
  expect(container).toHaveTextContent('Title of Manuscript');
});

it('generates the short description based on the current description', async () => {
  mockGetGeneratedShortDescription.mockResolvedValueOnce({
    shortDescription: 'test generated short description 1',
  });

  await renderPage();

  // Wait for form to be fully loaded
  await waitFor(() => {
    expect(screen.getByRole('textbox', { name: /Manuscript Description/i })).toBeInTheDocument();
  });

  const descriptionTextbox = screen.getByRole('textbox', {
    name: /Manuscript Description/i,
  });
  await userEvent.type(descriptionTextbox, 'Some description');

  await userEvent.click(screen.getByRole('button', { name: 'Generate' }));

  await waitFor(() => {
    expect(mockGetGeneratedShortDescription).toHaveBeenCalledWith(
      'Some description',
      expect.anything(),
    );
    expect(
      screen.getByRole('textbox', { name: /short description/i }),
    ).toHaveValue('test generated short description 1');
  });
});
