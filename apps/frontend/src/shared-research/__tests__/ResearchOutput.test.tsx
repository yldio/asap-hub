import React, { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { sharedResearch } from '@asap-hub/routing';

import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import ResearchOutput from '../ResearchOutput';
import { getResearchOutput } from '../api';
import { refreshResearchOutputState } from '../state';

jest.mock('../api');

const id = '42';

const mockGetResearchOutput = getResearchOutput as jest.MockedFunction<
  typeof getResearchOutput
>;
beforeEach(() => {
  mockGetResearchOutput.mockClear();
  mockGetResearchOutput.mockResolvedValue({
    ...createResearchOutputResponse(),
    type: 'Proposal',
    id,
  });
});

const renderComponent = async () => {
  const result = render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshResearchOutputState(id), Math.random())
      }
    >
      <Auth0Provider user={{}}>
        <WhenReady>
          <Suspense fallback="Loading...">
            <MemoryRouter
              initialEntries={[
                '/prev',
                sharedResearch({}).researchOutput({ researchOutputId: id }).$,
              ]}
              initialIndex={1}
            >
              <Switch>
                <Route path="/prev">Previous Page</Route>
                <Route
                  path={
                    sharedResearch.template +
                    sharedResearch({}).researchOutput.template
                  }
                  component={ResearchOutput}
                />
              </Switch>
            </MemoryRouter>
          </Suspense>
        </WhenReady>
      </Auth0Provider>
    </RecoilRoot>,
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

describe('a proposal research output', () => {
  it('renders with its team', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      type: 'Proposal',
      team: {
        displayName: 'Proposal Team',
        id: '123',
      },
      title: 'Proposal title!',
    });
    const { getByRole, getByText } = await renderComponent();
    expect(getByText(/proposal team/i)).toBeVisible();
    expect(getByRole('heading').textContent).toEqual('Proposal title!');
  });
  it('links to a team', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      type: 'Proposal',
      team: {
        id: '0d074988-60c3-41e4-9f3a-e40cc65e5f4a',
        displayName: 'Sulzer, D',
      },
    });

    const { getByText } = await renderComponent();
    expect(getByText('Team Sulzer, D')).toHaveAttribute(
      'href',
      expect.stringMatching(/0d074988-60c3-41e4-9f3a-e40cc65e5f4a/),
    );
  });
});

describe('a non-proposal research output', () => {
  it('renders with tags', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      type: 'Protocol',
      tags: ['Example Tag'],
      title: 'Proposal title!',
    });
    const { getByRole, getByText } = await renderComponent();
    expect(getByText(/Example Tag/i)).toBeVisible();
    expect(getByRole('heading', { level: 1 }).textContent).toEqual(
      'Proposal title!',
    );
  });
});

it('renders the 404 page for a missing research output', async () => {
  mockGetResearchOutput.mockResolvedValue(undefined);
  const { getByText } = await renderComponent();
  expect(getByText(/sorry.+page/i)).toBeVisible();
});
