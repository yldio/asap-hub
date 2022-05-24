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
    documentType: 'Article',
    id,
  });
});

const researchOutputRoute = sharedResearch({}).researchOutput({
  researchOutputId: id,
});

const renderComponent = async (path: string) => {
  const result = render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshResearchOutputState(id), Math.random())
      }
    >
      <Auth0Provider user={{ teams: [{}] }}>
        <WhenReady>
          <Suspense fallback="Loading...">
            <MemoryRouter
              initialEntries={['/prev', researchOutputRoute.$]}
              initialIndex={1}
            >
              <Switch>
                <Route path="/prev">Previous Page</Route>
                <Route
                  path={
                    sharedResearch.template +
                    sharedResearch({}).researchOutput.template
                  }
                >
                  <ResearchOutput />
                </Route>
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
      id,
      documentType: 'Grant Document',
      teams: [
        {
          displayName: 'Grant Document Team',
          id: '123',
        },
      ],
      title: 'Grant Document title!',
    });
    const { getByText } = await renderComponent(researchOutputRoute.$);

    expect(getByText('Grant Document title!')).toBeVisible();
  });
  it('links to a teams', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      id,
      documentType: 'Grant Document',
      teams: [
        {
          id: '0d074988-60c3-41e4-9f3a-e40cc65e5f4a',
          displayName: 'Sulzer, D',
        },
      ],
    });

    const { getByText } = await renderComponent(researchOutputRoute.$);
    expect(getByText('Team Sulzer, D')).toHaveAttribute(
      'href',
      expect.stringMatching(/0d074988-60c3-41e4-9f3a-e40cc65e5f4a/),
    );
  });

  it('renders the edit page', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      documentType: 'Bioinformatics',
    });
    const { getByRole } = await renderComponent(
      researchOutputRoute.editResearchOutput({}).$,
    );
    expect(
      getByRole('heading', { name: /Share bioinformatics/i }),
    ).toBeInTheDocument();
  });
});

describe('a not-grant-document research output', () => {
  it('renders with tags', async () => {
    mockGetResearchOutput.mockResolvedValue({
      ...createResearchOutputResponse(),
      id,
      documentType: 'Protocol',
      tags: ['Example Tag'],
      title: 'Not-Grant-Document title!',
    });
    const { getByRole, getByText } = await renderComponent(
      researchOutputRoute.$,
    );
    expect(getByText(/Example Tag/i)).toBeVisible();
    expect(getByRole('heading', { level: 1 }).textContent).toEqual(
      'Not-Grant-Document title!',
    );
  });
});

it('renders the 404 page for a missing research output', async () => {
  mockGetResearchOutput.mockResolvedValue(undefined);
  const { getByText } = await renderComponent(researchOutputRoute.$);
  expect(getByText(/sorry.+page/i)).toBeVisible();
});
