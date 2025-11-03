import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { projects } from '@asap-hub/routing';
import userEvent from '@testing-library/user-event';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';

import Projects from '../Projects';

const renderProjectsPage = async (pathname: string, query = '') => {
  const { container } = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname, search: query }]}>
              <Route path={projects.template}>
                <Projects />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(screen.queryByText(/loading/i), {
    timeout: 30_000,
  });

  return container;
};

describe('Projects Routes', () => {
  it('redirects to discovery projects when the index page is accessed', async () => {
    await renderProjectsPage(projects({}).$);
    // Verify we're on Discovery Projects by checking for the description
    expect(
      await screen.findByText(
        /Discovery Projects are collaborative research projects/i,
      ),
    ).toBeVisible();
  });

  it.each([
    {
      type: 'Discovery',
      path: projects.template + projects({}).discoveryProjects.template,
      expectedDescription:
        /Discovery Projects are collaborative research projects/i,
    },
    {
      type: 'Resource',
      path: projects.template + projects({}).resourceProjects.template,
      expectedDescription:
        /Resource Projects are projects whose primary objective is to generate research tools/i,
    },
    {
      type: 'Trainee',
      path: projects.template + projects({}).traineeProjects.template,
      expectedDescription:
        /Trainee Projects provide early-career scientists with dedicated support/i,
    },
  ])('renders $type Projects page', async ({ path, expectedDescription }) => {
    await renderProjectsPage(path);
    expect(await screen.findByText(expectedDescription)).toBeVisible();
  });

  it('allows navigation between project types', async () => {
    await renderProjectsPage(
      projects.template + projects({}).discoveryProjects.template,
    );

    // Start on Discovery Projects - verify by checking for description
    expect(
      screen.getByText(
        /Discovery Projects are collaborative research projects/i,
      ),
    ).toBeVisible();

    // Navigate to Resource Projects tab
    const resourceTab = screen.getByText('Resource Projects', {
      selector: 'p',
    });
    await userEvent.click(resourceTab);

    // Should now show Resource Projects description
    expect(
      await screen.findByText(
        /Resource Projects are projects whose primary objective is to generate research tools/i,
      ),
    ).toBeVisible();

    // Navigate to Trainee Projects tab
    const traineeTab = screen.getByText('Trainee Projects', { selector: 'p' });
    await userEvent.click(traineeTab);

    // Should now show Trainee Projects description
    expect(
      await screen.findByText(
        /Trainee Projects provide early-career scientists with dedicated support/i,
      ),
    ).toBeVisible();
  });

  it('allows typing in search queries', async () => {
    await renderProjectsPage(
      projects.template + projects({}).discoveryProjects.template,
    );
    const searchBox = screen.getByRole('searchbox') as HTMLInputElement;

    userEvent.type(searchBox, 'test project');
    expect(searchBox.value).toEqual('test project');
  });

  it('preserves search query when switching tabs', async () => {
    await renderProjectsPage(
      projects.template + projects({}).discoveryProjects.template,
      '?searchQuery=biomarker',
    );
    const searchBox = screen.getByRole('searchbox') as HTMLInputElement;

    expect(searchBox.value).toEqual('biomarker');

    const resourceTab = screen.getByText('Resource Projects', {
      selector: 'p',
    });
    await userEvent.click(resourceTab);

    await waitFor(() => {
      expect(searchBox.value).toEqual('biomarker');
    });
  });

  it.each([
    {
      type: 'Discovery',
      path: `${projects.template}/discovery/1/about`,
    },
    {
      type: 'Resource',
      path: `${projects.template}/resource/1/about`,
    },
    {
      type: 'Trainee',
      path: `${projects.template}/trainee/1/about`,
    },
  ])('renders $type project detail page', async ({ path }) => {
    await renderProjectsPage(path);
    // Check that we're on a detail page by looking for the Overview section
    expect(await screen.findByText('Overview')).toBeVisible();
  });
});
