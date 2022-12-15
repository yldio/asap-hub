import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  ResearchOutputDocumentType,
  ResearchOutputResponse,
} from '@asap-hub/model';
import {
  ResearchOutputPermissionsContext,
  ToastContext,
} from '@asap-hub/react-context';
import { network, OutputDocumentTypeParameter } from '@asap-hub/routing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { ContextType, Suspense } from 'react';
import { Route, StaticRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { refreshWorkingGroupState } from '../state';
import WorkingGroupOutput, {
  paramOutputDocumentTypeToResearchOutputDocumentType,
} from '../WorkingGroupOutput';

jest.setTimeout(30000);
jest.mock('../api');
jest.mock('../../users/api');
jest.mock('../../../shared-research/api');

describe('WorkingGroupOutput', () => {
  const mockToast = jest.fn() as jest.MockedFunction<
    ContextType<typeof ToastContext>
  >;
  interface RenderPageOptions {
    workingGroupId: string;
    outputDocumentType?: OutputDocumentTypeParameter;
    canCreateUpdate?: boolean;
    researchOutputData?: ResearchOutputResponse;
  }

  it('Renders the research output', async () => {
    await renderPage({
      workingGroupId: '42',
      outputDocumentType: 'article',
    });

    expect(
      screen.getByRole('heading', { name: /Share a Working Group Article/i }),
    ).toBeInTheDocument();
  });

  it.each<{
    param: OutputDocumentTypeParameter;
    outputType: ResearchOutputDocumentType;
  }>([
    { param: 'article', outputType: 'Article' },
    { param: 'unknown' as OutputDocumentTypeParameter, outputType: 'Article' },
  ])('maps from $param to $outputType', ({ param, outputType }) => {
    expect(paramOutputDocumentTypeToResearchOutputDocumentType(param)).toEqual(
      outputType,
    );
  });

  async function renderPage({
    canCreateUpdate = true,
    workingGroupId = 'wg1',
    outputDocumentType = 'article',
  }: RenderPageOptions) {
    const path =
      network.template +
      network({}).workingGroups.template +
      network({}).workingGroups({}).workingGroup.template +
      network({}).workingGroups({}).workingGroup({ workingGroupId })
        .createOutput.template;

    render(
      <RecoilRoot
        initializeState={({ set }) =>
          set(refreshWorkingGroupState(workingGroupId), Math.random())
        }
      >
        <Suspense fallback="loading">
          <ToastContext.Provider value={mockToast}>
            <Auth0Provider user={{}}>
              <WhenReady>
                <StaticRouter
                  location={
                    network({})
                      .workingGroups({})
                      .workingGroup({ workingGroupId })
                      .createOutput({ outputDocumentType }).$
                  }
                >
                  <ResearchOutputPermissionsContext.Provider
                    value={{ canCreateUpdate }}
                  >
                    <Route path={path}>
                      <WorkingGroupOutput workingGroupId={workingGroupId} />
                    </Route>
                  </ResearchOutputPermissionsContext.Provider>
                </StaticRouter>
              </WhenReady>
            </Auth0Provider>
          </ToastContext.Provider>
        </Suspense>
      </RecoilRoot>,
    );
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  }
});
