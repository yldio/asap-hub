import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  waitForElementToBeRemoved,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { createOutput } from '../../outputs/api';
import CreateProjectOutput from '../CreateProjectOutput';

jest.mock('../../outputs/api');

const mockCreateOutput = createOutput as jest.MockedFunction<
  typeof createOutput
>;

const renderCreateProjectOutput = async (
  documentType: gp2Routing.OutputDocumentTypeParameter = 'article',
) => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                gp2Routing
                  .projects({})
                  .project({ projectId: '1' })
                  .createOutput({ outputDocumentType: documentType }).$,
              ]}
            >
              <Route
                path={
                  gp2Routing.projects.template +
                  gp2Routing.projects({}).project.template +
                  gp2Routing.projects({}).project({ projectId: '1' })
                    .createOutput.template
                }
              >
                <CreateProjectOutput />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

it('renders the title', async () => {
  await renderCreateProjectOutput();
  expect(screen.getByRole('heading', { name: /share/i })).toBeVisible();
});

it('publishes the output', async () => {
  const title = 'this is the output title';
  await renderCreateProjectOutput('form');

  userEvent.type(screen.getByRole('textbox', { name: /title/i }), title);
  userEvent.click(screen.getByRole('button', { name: /publish/i }));
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /publish/i })).toBeEnabled();
  });
  expect(mockCreateOutput).toHaveBeenCalledWith(
    {
      title,
      documentType: 'Form',
      projects: expect.arrayContaining(['1']),
      workingGroups: undefined,
    },
    expect.anything(),
  );
});
