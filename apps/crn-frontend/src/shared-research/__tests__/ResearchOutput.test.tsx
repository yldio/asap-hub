import { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { sharedResearch } from '@asap-hub/routing';

import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
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
    type: 'Article',
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

describe('a grant document research output', () => {
  it('renders with its teams', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      type: 'Grant Document',
      teams: [
        {
          displayName: 'Grant Document Team',
          id: '123',
        },
      ],
      title: 'Grant Document title!',
    });
    const { getByRole, getByText } = await renderComponent();

    expect(getByText(/grant document team/i)).toBeVisible();
    expect(getByRole('heading', { level: 1 }).textContent).toEqual(
      'Grant Document title!',
    );
  });
  it('links to a teams', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      type: 'Grant Document',
      teams: [
        {
          id: '0d074988-60c3-41e4-9f3a-e40cc65e5f4a',
          displayName: 'Sulzer, D',
        },
      ],
    });

    const { getByText } = await renderComponent();
    expect(getByText('Team Sulzer, D')).toHaveAttribute(
      'href',
      expect.stringMatching(/0d074988-60c3-41e4-9f3a-e40cc65e5f4a/),
    );
  });
});

describe('a not-grant-document research output', () => {
  it('renders with tags', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      type: 'Protocol',
      tags: ['Example Tag'],
      title: 'Not-Grant-Document title!',
    });
    const { getByRole, getByText } = await renderComponent();
    expect(getByText(/Example Tag/i)).toBeVisible();
    expect(getByRole('heading', { level: 1 }).textContent).toEqual(
      'Not-Grant-Document title!',
    );
  });
});

it('renders the 404 page for a missing research output', async () => {
  mockGetResearchOutput.mockResolvedValue(undefined);
  const { getByText } = await renderComponent();
  expect(getByText(/sorry.+page/i)).toBeVisible();
});
