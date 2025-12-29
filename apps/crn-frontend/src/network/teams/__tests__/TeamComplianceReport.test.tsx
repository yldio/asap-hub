import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { network } from '@asap-hub/routing';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps, Suspense, useEffect } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { createComplianceReport, getManuscript } from '../api';
import { ManuscriptToastProvider } from '../ManuscriptToastProvider';
import { refreshTeamState } from '../state';
import TeamComplianceReport from '../TeamComplianceReport';

const manuscriptResponse = {
  id: 'manuscript-1',
  title: 'The Manuscript',
  versions: [{ id: 'manuscript-version-1' }],
  status: 'Addendum Required',
  notificationList: '',
};
const complianceReportResponse = { id: 'compliance-report-1' };

const teamId = '42';

// Helper to capture location in tests
let currentLocation: { pathname: string; search: string } | null = null;
const LocationCapture = () => {
  const location = useLocation();
  useEffect(() => {
    currentLocation = { pathname: location.pathname, search: location.search };
  }, [location]);
  return null;
};

jest.mock('../api', () => ({
  createComplianceReport: jest.fn().mockResolvedValue(complianceReportResponse),
  getManuscript: jest.fn().mockResolvedValue(manuscriptResponse),
}));

const mockGetManuscript = getManuscript as jest.MockedFunction<
  typeof getManuscript
>;

beforeEach(() => {
  jest.resetModules();
  currentLocation = null;
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  // Mock getBoundingClientRect for Lexical editor
  if (typeof Range !== 'undefined') {
    Range.prototype.getBoundingClientRect = jest.fn(() => ({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
      toJSON: jest.fn(),
    }));
  }
  if (typeof Selection !== 'undefined') {
    Selection.prototype.getRangeAt = jest.fn(() => {
      const range = new Range();
      range.getBoundingClientRect = jest.fn(() => ({
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0,
        toJSON: jest.fn(),
      }));
      return range;
    });
  }
});

const renderPage = async (
  user: ComponentProps<typeof Auth0Provider>['user'] = {},
  initialPath?: string,
) => {
  const createComplianceReportPath =
    network.template +
    network({}).teams.template +
    network({}).teams({}).team.template +
    network({}).teams({}).team({ teamId }).workspace.template +
    network({}).teams({}).team({ teamId }).workspace({}).createComplianceReport
      .template;

  const workspacePath = `${network.template}${network({}).teams.template}${
    network({}).teams({}).team.template
  }${network({}).teams({}).team({ teamId }).workspace.template}/*`;

  const defaultInitialPath = network({})
    .teams({})
    .team({ teamId })
    .workspace({})
    .createComplianceReport({ manuscriptId: manuscriptResponse.id }).$;

  const { container, getByTestId, getByRole } = render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshTeamState(teamId), Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <MemoryRouter initialEntries={[initialPath ?? defaultInitialPath]}>
              <LocationCapture />
              <Routes>
                <Route
                  path={createComplianceReportPath}
                  element={
                    <ManuscriptToastProvider>
                      <TeamComplianceReport teamId={teamId} />
                    </ManuscriptToastProvider>
                  }
                />
                <Route path={workspacePath} element={<div>Workspace</div>} />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  return { container, getByTestId, getByRole };
};

it('renders compliance report form page', async () => {
  const { container } = await renderPage();

  expect(container).toHaveTextContent(
    'Share the compliance report associated with this manuscript.',
  );
  expect(container).toHaveTextContent('Title of Manuscript');
});

it('can publish a form when the data is valid and navigates to team workspace', async () => {
  jest.useRealTimers();

  const url = 'https://compliancereport.com';
  const description = 'compliance report description';
  const user = userEvent.setup();

  const { getByTestId, getByRole } = await renderPage();

  await user.type(getByRole('textbox', { name: /url/i }), url);

  const editor = await waitFor(() => getByTestId('editor'));

  // Use fireEvent.input for Lexical editor (required for Lexical)
  await act(async () => {
    await user.click(editor);
    fireEvent.input(editor, { data: description });
  });

  // Wait for Lexical's onChange to propagate to react-hook-form
  // then blur to trigger validation with the updated value
  await act(async () => {
    fireEvent.blur(editor);
  });

  await user.click(screen.getByLabelText(/Status/i));
  await user.click(screen.getByText(/Addendum Required/i));

  const shareButton = getByRole('button', { name: /Share/i });
  await waitFor(() => expect(shareButton).toBeEnabled(), { timeout: 5000 });

  await user.click(shareButton);

  const confirmButton = getByRole('button', {
    name: /Share Compliance Report/i,
  });
  await user.click(confirmButton);

  await waitFor(() => {
    expect(createComplianceReport).toHaveBeenCalledWith(
      {
        url,
        description,
        manuscriptVersionId: manuscriptResponse.versions[0]!.id,
        manuscriptId: manuscriptResponse.id,
        status: manuscriptResponse.status,
        notificationList: manuscriptResponse.notificationList,
      },
      expect.anything(),
    );
  });

  await waitFor(() => {
    expect(currentLocation).not.toBeNull();
    expect(currentLocation?.pathname).toBe(
      `/network/teams/${teamId}/workspace`,
    );
  });

  jest.useFakeTimers();
});

it('renders not found when the manuscript hook does not return a manuscript with a version', async () => {
  mockGetManuscript.mockResolvedValue(undefined);
  await renderPage();

  expect(screen.getByRole('heading').textContent).toContain(
    'Sorry! We can’t seem to find that page.',
  );
});
