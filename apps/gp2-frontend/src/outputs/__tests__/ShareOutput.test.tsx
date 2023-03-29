import { gp2 } from '@asap-hub/fixtures';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { updateOutput, getOutput } from '../api';
import ShareOutput from '../ShareOutput';

jest.mock('../../outputs/api');

const mockUpdateOutput = updateOutput as jest.MockedFunction<
  typeof updateOutput
>;
const mockGetOutput = getOutput as jest.MockedFunction<typeof getOutput>;

const renderShareOutput = async (outputId: string = 'ro0') => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                gp2Routing.outputs({}).output({ outputId }).edit({}).$,
              ]}
            >
              <Route
                path={
                  gp2Routing.outputs.template +
                  gp2Routing.outputs({}).output.template +
                  gp2Routing.outputs({}).output({ outputId }).edit.template
                }
              >
                <ShareOutput />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

describe('ShareOutput', () => {
  jest.resetAllMocks();
  afterEach(jest.resetAllMocks);
  it('renders the title', async () => {
    mockGetOutput.mockResolvedValueOnce(gp2.createOutputResponse());
    await renderShareOutput();
    expect(screen.getByRole('heading', { name: /share/i })).toBeVisible();
  });
  it('renders not found if output was not found', async () => {
    mockGetOutput.mockResolvedValueOnce(undefined);
    await renderShareOutput();
    expect(
      screen.getByRole('heading', {
        name: /Sorry! We can’t seem to find that page/i,
      }),
    ).toBeVisible();
  });

  it('saves the output', async () => {
    const title = 'Output title';
    const link = 'https://example.com';
    const id = 'output-id';
    mockGetOutput.mockResolvedValueOnce({
      ...gp2.createOutputResponse(),
      id,
      title,
      link,
    });
    mockUpdateOutput.mockResolvedValueOnce(gp2.createOutputResponse());

    await renderShareOutput(id);

    userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(await screen.findByRole('button', { name: /save/i })).toBeEnabled();
    expect(mockUpdateOutput).toHaveBeenCalledWith(
      id,
      expect.objectContaining({ title, link }),
      expect.anything(),
    );
  });
});
