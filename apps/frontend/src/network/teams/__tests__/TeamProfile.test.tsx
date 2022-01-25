import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { createTeamResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';

import { createResearchOutputListAlgoliaResponse } from '../../../__fixtures__/algolia';
import TeamProfile from '../TeamProfile';
import { getTeam, createTeamResearchOutput } from '../api';
import { refreshTeamState } from '../state';
import { getResearchOutputs } from '../../../shared-research/api';

jest.mock('../api');
jest.mock('../groups/api');
jest.mock('../../../shared-research/api');

describe('TeamProfile', () => {
  afterEach(() => jest.clearAllMocks());
  describe('TeamCreateOutputPage', () => {
    const dateReference = '2021-12-28T14:45';
    beforeEach(() =>
      jest
        .useFakeTimers('modern')
        .setSystemTime(new Date(dateReference).getTime()),
    );
    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('renders the header info', async () => {
      const teamResponse = createTeamResponse();
      const teamId = teamResponse.id;

      await renderPage(
        teamResponse,
        undefined,
        network({})
          .teams({})
          .team({ teamId })
          .createOutput({ outputType: 'Bioinformatics' }).$,
      );
      expect(
        screen.getByRole('heading', { name: /Share bioinformatics/i }),
      ).toBeInTheDocument();
    });
    it('submits to api', async () => {
      const teamResponse = createTeamResponse();
      const teamId = teamResponse.id;

      await renderPage(
        teamResponse,
        undefined,
        network({})
          .teams({})
          .team({ teamId })
          .createOutput({ type: 'Bioinformatics' }).$,
      );

      const button = screen.getByRole('button', { name: /Share/i });
      userEvent.click(button);
      expect(createTeamResearchOutput).toHaveBeenCalledWith(
        't0',
        expect.objectContaining({
          addedDate: expect.stringContaining(dateReference),
          asapFunded: undefined,
          link: 'https://hub.asap.science/',
          sharingStatus: 'Network Only',
          title: 'Output created through the ROMS form',
          type: 'Bioinformatics',
          usedInPublication: undefined,
        }),
        'Bearer id_token',
      );
    });
  });
  describe('TeamProfilePage', () => {
    it('renders the header info', async () => {
      const { getByText } = await renderPage({
        ...createTeamResponse(),
        displayName: 'Bla',
      });
      expect(getByText(/Team.+Bla/i)).toBeVisible();
    });

    it('renders the about info', async () => {
      const { getByText } = await renderPage();
      expect(getByText(/project overview/i)).toBeVisible();
    });

    it('navigates to the outputs tab', async () => {
      const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
        typeof getResearchOutputs
      >;
      mockGetResearchOutputs.mockResolvedValue({
        ...createResearchOutputListAlgoliaResponse(1),
      });
      const { getByText, findByText } = await renderPage();

      userEvent.click(getByText(/outputs/i, { selector: 'nav *' }));
      expect(await findByText(/Output 1/i)).toBeVisible();
    });

    it('navigates to the workspace tab', async () => {
      const { getByText, findByText } = await renderPage({
        ...createTeamResponse(),
        tools: [],
      });

      userEvent.click(getByText(/workspace/i, { selector: 'nav *' }));
      expect(await findByText(/tools/i)).toBeVisible();
    });
    it('does not allow navigating to the workspace tab when team tools are not available', async () => {
      const { queryByText } = await renderPage({
        ...createTeamResponse(),
        tools: undefined,
      });

      expect(
        queryByText(/workspace/i, { selector: 'nav *' }),
      ).not.toBeInTheDocument();
    });

    it('renders the 404 page for a missing team', async () => {
      const { getByText } = await renderPage(
        { ...createTeamResponse(), id: '42' },
        { teamId: '1337' },
      );
      expect(getByText(/sorry.+page/i)).toBeVisible();
    });

    it('deep links to the teams list', async () => {
      const { container, getByLabelText } = await renderPage({
        ...createTeamResponse({ teamMembers: 10 }),
        id: '42',
      });

      const anchor = getByLabelText(/\+\d/i).closest('a');
      expect(anchor).toBeVisible();
      const { hash } = new URL(anchor!.href, globalThis.location.href);

      expect(container.querySelector(hash)).toHaveTextContent(/team members/i);
    });
  });

  const renderPage = async (
    teamResponse = createTeamResponse(),
    { teamId = teamResponse.id } = {},
    initialEntries?: string,
  ) => {
    const mockGetTeam = getTeam as jest.MockedFunction<typeof getTeam>;
    mockGetTeam.mockImplementation(async (id) =>
      id === teamResponse.id ? teamResponse : undefined,
    );

    const result = render(
      <RecoilRoot
        initializeState={({ set }) =>
          set(refreshTeamState(teamResponse.id), Math.random())
        }
      >
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <MemoryRouter
                initialEntries={[
                  initialEntries ?? network({}).teams({}).team({ teamId }).$,
                ]}
              >
                <Route
                  path={
                    network.template +
                    network({}).teams.template +
                    network({}).teams({}).team.template
                  }
                  component={TeamProfile}
                />
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>,
    );
    await waitFor(() =>
      expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    return result;
  };
});
