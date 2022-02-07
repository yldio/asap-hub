import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';
import { useFlags } from '@asap-hub/react-context';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Suspense } from 'react';
import { StaticRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { network, OutputTypeParameter } from '@asap-hub/routing';
import { refreshTeamState } from '../state';
import TeamOutput, { paramOutputTypeToResearchOutputType } from '../TeamOutput';

it('Renders the research output', async () => {
  const teamId = 'team-id';
  await renderPage({ teamId });

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
  await renderPage({ teamId });
  expect(
    screen.queryByRole('heading', { name: /Share bioinformatics/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole('heading', {
      name: /Sorry! We can’t seem to find that page/i,
    }),
  ).toBeInTheDocument();
});

describe('paramOutputTypeToResearchOutputType', () => {
  it('maps from article to Article', () => {
    expect(paramOutputTypeToResearchOutputType('article')).toEqual('Article');
  });

  it('maps from bioinformatics to Bioinformatics', () => {
    expect(paramOutputTypeToResearchOutputType('bioinformatics')).toEqual(
      'Bioinformatics',
    );
  });

  it('maps from dataset to Dataset', () => {
    expect(paramOutputTypeToResearchOutputType('dataset')).toEqual('Dataset');
  });

  it('maps from lab-resource to Lab Resource', () => {
    expect(paramOutputTypeToResearchOutputType('lab-resource')).toEqual(
      'Lab Resource',
    );
  });

  it('maps from protocol to Protocol', () => {
    expect(paramOutputTypeToResearchOutputType('protocol')).toEqual('Protocol');
  });

  it('defaults to article on unknown input', () => {
    expect(
      paramOutputTypeToResearchOutputType('unknown' as OutputTypeParameter),
    ).toEqual('Article');
  });
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
              location={network({})
                .teams({})
                .team({ teamId })
                .createOutput({ outputType })}
            >
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
