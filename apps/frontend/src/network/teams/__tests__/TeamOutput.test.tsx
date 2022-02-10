import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';
import { useFlags } from '@asap-hub/react-context';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Suspense } from 'react';
import { StaticRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { network, OutputTypeParameter } from '@asap-hub/routing';
import { refreshTeamState } from '../state';
import TeamOutput, { paramOutputTypeToResearchOutputType } from '../TeamOutput';

it('Renders the research output', async () => {
  const teamId = 'team-id';
  await renderPage({ teamId, outputType: 'bioinformatics' });

  expect(
    screen.getByRole('heading', { name: /Share bioinformatics/i }),
  ).toBeInTheDocument();
});

it('switches research output type based on parameter', async () => {
  const teamId = 'team-id';
  await renderPage({ teamId, outputType: 'article' });

  expect(
    screen.getByRole('heading', { name: /Share an article/i }),
  ).toBeInTheDocument();
});

it('Shows NotFoundPage when feature flag is off', async () => {
  const teamId = 'team-id';
  await renderPage({ teamId, featureFlagEnabled: false });
  expect(
    screen.queryByRole('heading', { name: /Share bioinformatics/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole('heading', {
      name: /Sorry! We can’t seem to find that page/i,
    }),
  ).toBeInTheDocument();
});

it.each([
  ['article', 'Article'],
  ['bioinformatics', 'Bioinformatics'],
  ['dataset', 'Dataset'],
  ['lab-resource', 'Lab Resource'],
  ['protocol', 'Protocol'],
  ['unknown' as OutputTypeParameter, 'Article'],
])('maps from %s to %s', (param, outputType) => {
  expect(paramOutputTypeToResearchOutputType(param)).toEqual(outputType);
});

interface RenderPageOptions {
  teamId: string;
  outputType?: OutputTypeParameter;
  featureFlagEnabled?: boolean;
}

const renderPage = async ({
  featureFlagEnabled = true,
  teamId,
  outputType = 'bioinformatics',
}: RenderPageOptions) => {
  const {
    result: {
      current: { disable, enable },
    },
  } = renderHook(useFlags);

  if (featureFlagEnabled) {
    enable('ROMS_FORM');
  } else {
    disable('ROMS_FORM');
  }

  const path =
    network.template +
    network({}).teams.template +
    network({}).teams({}).team.template +
    network({}).teams({}).team({ teamId }).createOutput.template;

  const result = render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshTeamState(teamId), Math.random())
      }
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <StaticRouter
              location={
                network({})
                  .teams({})
                  .team({ teamId })
                  .createOutput({ outputType }).$
              }
            >
              <Route path={path}>
                <TeamOutput teamId={teamId} />
              </Route>
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
