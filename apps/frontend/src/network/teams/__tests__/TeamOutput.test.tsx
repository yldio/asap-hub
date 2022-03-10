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
import { ResearchOutputType } from '@asap-hub/model';
import { fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { createTeamResearchOutput } from '../api';
import { refreshTeamState, getAuthorLabel } from '../state';
import TeamOutput, { paramOutputTypeToResearchOutputType } from '../TeamOutput';

jest.mock('../api');
jest.mock('../../users/api');

const ENTER_KEYCODE = 13;

const mockCreateTeamResearchOutput =
  createTeamResearchOutput as jest.MockedFunction<
    typeof createTeamResearchOutput
  >;

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
    screen.queryByRole('heading', { name: /Share/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole('heading', {
      name: /Sorry! We can’t seem to find that page/i,
    }),
  ).toBeInTheDocument();
});

it('can submit a form when form data is valid', async () => {
  const teamId = 'team-id';

  await renderPage({ teamId, outputType: 'lab-resource' });

  fireEvent.change(screen.getByLabelText(/url/i), {
    target: { value: 'http://example.com' },
  });
  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: 'example title' },
  });
  fireEvent.change(screen.getByLabelText(/description/i), {
    target: { value: 'example description' },
  });
  userEvent.type(screen.getByLabelText(/type/i), 'Animal Model');
  fireEvent.keyDown(screen.getByLabelText(/type/i), {
    keyCode: ENTER_KEYCODE,
  });

  userEvent.click(screen.getByLabelText(/Labs/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  userEvent.click(screen.getByText('Example 1 Lab'));

  userEvent.click(screen.getByLabelText(/Authors/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  userEvent.click(screen.getByText('Person A 3'));

  const button = screen.getByRole('button', { name: /Share/i });

  userEvent.click(button);

  await waitFor(() => {
    expect(mockCreateTeamResearchOutput).toHaveBeenCalledWith(
      {
        type: 'Lab Resource',
        addedDate: expect.anything(),
        tags: [],
        asapFunded: undefined,
        usedInPublication: undefined,
        sharingStatus: 'Network Only',
        teamId: 'team-id',
        link: 'http://example.com',
        title: 'example title',
        description: 'example description',
        subTypes: ['Animal Model'],
        labs: ['l0'],
        authors: ['u2'],
      },
      expect.anything(),
    );
    expect(button).toBeEnabled();
  });
});

it.each<{ param: OutputTypeParameter; outputType: ResearchOutputType }>([
  { param: 'article', outputType: 'Article' },
  { param: 'bioinformatics', outputType: 'Bioinformatics' },
  { param: 'dataset', outputType: 'Dataset' },
  { param: 'lab-resource', outputType: 'Lab Resource' },
  { param: 'protocol', outputType: 'Protocol' },
  { param: 'unknown' as OutputTypeParameter, outputType: 'Article' },
])('maps from $param to $outputType', ({ param, outputType }) => {
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

describe('getAuthorLabel', () => {
  it('should display (Non CRN) for external-author', () => {
    expect(
      getAuthorLabel({ id: '1234', displayName: 'external author' }),
    ).toEqual('external author (Non CRN)');
  });
  it('should not add suffix for internal user', () => {
    expect(
      getAuthorLabel({
        id: '1234',
        displayName: 'internal user',
        email: 'example@domain.com',
      }),
    ).toEqual('internal user');
  });
});
