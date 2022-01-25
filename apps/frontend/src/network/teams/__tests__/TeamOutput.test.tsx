import { disable } from '@asap-hub/flags';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { StaticRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { refreshTeamState } from '../state';
import TeamOutput from '../TeamOutput';

describe('TeamOutput', () => {
  it('Renders the research output', async () => {
    const teamId = 'team-id';
    await renderPage(teamId);
    expect(
      screen.getByRole('heading', { name: /Share bioinformatics/i }),
    ).toBeInTheDocument();
  });

  it('Shows NotFoundPage when feature flag is off', async () => {
    disable('ROMS_FORM');

    const teamId = 'team-id';
    await renderPage(teamId);
    expect(
      screen.queryByRole('heading', { name: /Share bioinformatics/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /Sorry! We can’t seem to find that page/i,
      }),
    ).toBeInTheDocument();
  });

  const renderPage = async (teamId: string) => {
    const result = render(
      <RecoilRoot
        initializeState={({ set }) =>
          set(refreshTeamState(teamId), Math.random())
        }
      >
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <StaticRouter>
                <TeamOutput teamId={teamId} />
              </StaticRouter>
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
